import fs from "fs";
import path from "path";
import { AccountReport, RoadSegment } from "../models/index.js";
import { UPLOAD_DIRECTORY } from "../constants/uploadConstants.js";
import { produceMessage } from "../../../kafkaOnline.config.js";
import { formatAccountReport } from "../utils/formatAccountReport.js";

const PRODUCE_TOPIC = process.env.KAFKA_TOPIC_PRODUCER || "express-topic";

export const getAccountReports = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      typeReport,
      congestionLevel,
      account_id,
      startDate,
      endDate,
      analysisStatus,
      hasReview,
    } = req.query;

    const query = {};
    if (typeReport) query.typeReport = typeReport;
    if (congestionLevel) query.congestionLevel = congestionLevel;
    if (account_id) query.account_id = account_id;
    if (analysisStatus !== undefined)
      query.analysisStatus = analysisStatus === "true";

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const rawReports = await AccountReport.find(query)
      .sort({ timestamp: -1 })
      .populate({
        path: "account_id",
        select: "-password -otp -otpExpiration -otpVerified",
        populate: { path: "roles", select: "name" },
      })
      .populate({
        path: "reviews",
        select: "reason status reviewed_by reviewed_at",
        populate: {
          path: "reviewed_by",
          select: "username email",
        },
      });

    const reportsWithVirtuals = rawReports.map(doc =>
      doc.toObject({ virtuals: true })
    );

    let filteredReports = reportsWithVirtuals;
    if (hasReview === "true") {
      filteredReports = reportsWithVirtuals.filter(
        (r) => Array.isArray(r.reviews) && r.reviews.length > 0
      );
    }

    const totalReports = filteredReports.length;

    const paginatedReports = filteredReports
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice((page - 1) * limit, page * limit);

    const formattedReports = paginatedReports.map(formatAccountReport);

    return res.status(200).json({
      success: true,
      total: totalReports,
      count: formattedReports.length,
      totalPages: Math.ceil(totalReports / limit),
      currentPage: parseInt(page),
      data: formattedReports,
    });
  } catch (error) {
    console.error("Error fetching account reports:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAccountReportById = async (req, res) => {
  try {
    const reportId = req.params.id;

    const report = await AccountReport.findById(reportId)
      .populate({
        path: "account_id",
        select: "-password -otp -otpExpiration -otpVerified",
        populate: { path: "roles", select: "name" },
      })
      .populate({
        path: "reviews",
        select: "reason status reviewed_by reviewed_at",
        populate: {
          path: "reviewed_by",
          select: "username email",
        },
      });

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report does not exist" });
    }

    const formattedReport = formatAccountReport(report);

    return res.status(200).json({
      success: true,
      data: formattedReport,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createAccountReport = async (req, res) => {
  try {
    const { description, typeReport, congestionLevel, longitude, latitude } =
      req.body;
    const account_id = req.account_id;

    const uploadedImages = Array.isArray(req.body.uploadedImages)
      ? req.body.uploadedImages.map((url) => ({ img: url }))
      : [];
    const searchRadiusInMeters = 10;

    const nearbyRoadSegments = await RoadSegment.find({
      roadSegmentLine: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: searchRadiusInMeters,
        },
      },
    });
    const newReport = new AccountReport({
      account_id,
      description,
      typeReport,
      congestionLevel,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      listImg: uploadedImages,
      roadSegment_ids: nearbyRoadSegments.map((segment) => segment._id),
    });

    await newReport.save();
    const timestamp = newReport.createdAt;

    if (nearbyRoadSegments.length === 0) {
      req.cachedReports = req.cachedReports
        ? req.cachedReports.push(newReport)
        : [newReport];
      console.log("Report added to cache:", newReport._id);
    } else {
      console.log("Nearby RoadSegment(s) found, report not cached.");
    }

    const { location, ...rest } = newReport._doc;
    const responseReport = {
      latitude: location.coordinates[1],
      longitude: location.coordinates[0],
      ...rest,
    };

    const messageObject = {
      reportId: newReport._id,
      account_id,
      description,
      typeReport,
      congestionLevel,
      longitude,
      latitude,
      listImg: uploadedImages,
      timestamp,
    };
    produceMessage(PRODUCE_TOPIC, messageObject, "create");

    res.status(201).json({ success: true, data: responseReport });
  } catch (error) {
    console.error("Error creating account report:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAccountReport = async (req, res) => {
  const reportId = req.params.id;
  const { replaceImageId, ...updateData } = req.body;
  const account_id = req.account_id;

  try {
    let report = cachedReports.find((r) => r._id.toString() === reportId);

    if (!report) {
      report = await AccountReport.findById(reportId);
      if (!report) {
        return res
          .status(404)
          .json({ success: false, message: "Report not found." });
      }
    }

    const isOwner = report.account_id.toString() === account_id;

    delete updateData.timestamp;
    delete updateData.location;

    if (isOwner) {
      if (
        req.files.length == 0 &&
        report.listImg.length - replaceImageId.length <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "At least one image must be kept in the report.",
        });
      }

      if (replaceImageId && replaceImageId.length > 0) {
        replaceImageId.forEach((item) => {
          const imageIndex = report.listImg.findIndex(
            (img) => img._id.toString() === item
          );
          if (imageIndex !== -1) {
            const imagePath = path.join(
              UPLOAD_DIRECTORY,
              report.listImg[imageIndex].img
            );
            fs.unlink(imagePath, (err) => {
              if (err) {
                console.error(`Error deleting image: ${imagePath}`, err);
              }
            });

            report.listImg.splice(imageIndex, 1);
          }
        });
      }

      if (req.files && req.files.length > 0) {
        const newImages = req.files.map((file) => ({ img: file.filename }));
        report.listImg.push(...newImages); // Append new images to the list
      }
    } else {
      // If the user is an admin, disallow image updates
      if (replaceImageId && replaceImageId.length > 0) {
        return res.status(403).json({
          success: false,
          message: "Admins cannot edit images.",
        });
      }
    }

    Object.assign(report, updateData);

    const updatedReport = await report.save();

    const cacheIndex = cachedReports.findIndex(
      (r) => r._id.toString() === reportId
    );
    if (cacheIndex !== -1) {
      cachedReports[cacheIndex] = updatedReport;
    }

    return res.status(200).json({
      success: true,
      data: updatedReport,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAccountReport = async (req, res) => {
  const reportId = req.params.id;

  try {
    let report = cachedReports.find((r) => r._id.toString() === reportId);

    if (!report) {
      report = await AccountReport.findById(reportId);
      if (!report) {
        return res
          .status(404)
          .json({ success: false, message: "Report not found." });
      }
    }

    if (report.listImg && report.listImg.length > 0) {
      report.listImg.forEach((image) => {
        const imagePath = path.join(UPLOAD_DIRECTORY, image.img);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Error deleting image at ${imagePath}:`, err.message);
          }
        });
      });
    }

    await AccountReport.findByIdAndDelete(reportId);

    cachedReports = cachedReports.filter((r) => r._id.toString() !== reportId);

    res.status(200).json({
      success: true,
      message: "Report and associated images deleted successfully.",
      data: {
        reportId: report._id,
        description: report.description,
        typeReport: report.typeReport,
        congestionLevel: report.congestionLevel,
        analysisStatus: report.analysisStatus,
        longitude: report.location.coordinates[0],
        latitude: report.location.coordinates[1],
        timestamp: report.timestamp,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        accountId: report.account_id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
