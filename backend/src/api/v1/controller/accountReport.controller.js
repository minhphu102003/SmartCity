import fs from 'fs';
import path from 'path';
import AccountReport from "../models/accountReport.js";
import RoadSegment from '../models/roadSegment.js';
import {UPLOAD_DIRECTORY} from "../constants/uploadConstants.js";
import {produceMessage} from "../../../config/kafka.config.js";

const PRODUCE_TOPIC = process.env.KAFKA_TOPIC_PRODUCER || 'express-topic';
const DEMO_TOPIC = process.env.KAFKA_TOPIC_CONSUMER || 'python-topic';

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
    } = req.query;
    const query = {};
    // Thiết lập các điều kiện lọc
    if (typeReport) query.typeReport = typeReport;
    if (congestionLevel) query.congestionLevel = congestionLevel;
    if (account_id) query.account_id = account_id;
    if (analysisStatus) query.analysisStatus = analysisStatus === "true";

    // Lọc theo khoảng thời gian
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    // Tìm và populate dữ liệu với phân trang
    const reports = await AccountReport.find(query)
      .sort({ timestamp: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate({
        path: "account_id",
        select: "-password -otp -otpExpiration -otpVerified",
        populate: { path: "roles", select: "name" },
      })
      .exec();

    const totalReports = await AccountReport.countDocuments(query);

    // Tạo cấu trúc JSON đơn giản và làm phẳng
    const formattedReports = reports.map(report => ({
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
      imgs: report.listImg,
      accountId: report.account_id._id,
      username: report.account_id.username,
      roles: report.account_id.roles.map(role => role.name),
    }));

    res.status(200).json({
      success: true,
      total: totalReports,
      count: formattedReports.length,
      totalPages: Math.ceil(totalReports / limit),
      currentPage: parseInt(page),
      data: formattedReports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAccountReportById = async (req, res) => {
  try {
    const reportId = req.params.id;

    // Find the report and populate account information
    const report = await AccountReport.findById(reportId).populate({
      path: "account_id",
      select: "-password -otp -otpExpiration -otpVerified",
      populate: { path: "roles", select: "name" },
    });

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report does not exist" });
    }

    // Flatten the data for a simpler response structure
    const formattedReport = {
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
      imgs: report.listImg,
      accountId: report.account_id._id,
      username: report.account_id.username,
      roles: report.account_id.roles.map(role => role.name),
    };

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
    const { description, typeReport, congestionLevel, longitude, latitude } = req.body;
    const account_id = req.account_id;

    // Lấy danh sách ảnh được tải lên từ Multer
    const uploadedImages = req.files.map((file) => ({ img: file.filename }));

    // Bán kính tìm kiếm xấp xỉ (10m = 10 / 6378.1 radians, với bán kính Trái Đất = 6378.1 km)
    const searchRadius = 10 / 6378100;

    // Tìm các đoạn đường gần tọa độ báo cáo
    const nearbyRoadSegments = await RoadSegment.find({
      "roadSegmentLine": {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], searchRadius],
        },
      },
    });

    // Tạo báo cáo mới
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
      roadSegment_ids: nearbyRoadSegments.map((segment) => segment._id), // Gắn các đoạn đường phù hợp
    });

    await newReport.save();

    // Chỉ thêm vào cache nếu không tìm thấy RoadSegment nào
    if (nearbyRoadSegments.length === 0) {
      req.cachedReports = req.cachedReports.push(newReport);
      console.log("Report added to cache:", newReport._id);
    } else {
      console.log("Nearby RoadSegment(s) found, report not cached.");
    }

    // Tạo response
    const { location, ...rest } = newReport._doc;
    const responseReport = {
      latitude: location.coordinates[1],
      longitude: location.coordinates[0],
      ...rest,
    };

    // Gửi thông điệp tới Kafka
    const messageObject = {
      reportId: newReport._id,
      account_id,
      description,
      typeReport,
      congestionLevel,
      longitude,
      latitude,
      listImg: uploadedImages,
    };
    produceMessage(PRODUCE_TOPIC, messageObject, "create");

    const messageObjectSendDemo = {
      reportId: newReport._id,
      account_id,
      description,
      typeReport,
      congestionLevel,
      longitude,
      latitude,
      img: uploadedImages[0]?.img || "",
    };
    produceMessage(DEMO_TOPIC, messageObjectSendDemo, "user report");

    // Trả về kết quả cho client
    res.status(201).json({ success: true, data: responseReport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const updateAccountReport = async (req, res) => {
  const reportId = req.params.id;
  const { replaceImageId, ...updateData } = req.body; // Extract replaceImageId and other update data
  const account_id = req.account_id;

  try {
    // Check if the report exists in cache first
    let report = cachedReports.find((r) => r._id.toString() === reportId);

    if (!report) {
      // If not in cache, fetch from DB
      report = await AccountReport.findById(reportId);
      if (!report) {
        return res.status(404).json({ success: false, message: "Report not found." });
      }
    }

    // Check if the user is an admin or owner
    const isOwner = report.account_id.toString() === account_id;

    // Remove fields that are not allowed to be updated
    delete updateData.timestamp;
    delete updateData.location;

    // If the user is the owner, handle image updates
    if (isOwner) {
      // Calculate remaining images count after deletions
      if (req.files.length == 0 && (report.listImg.length - replaceImageId.length <= 0)) {
        return res.status(400).json({
          success: false,
          message: "At least one image must be kept in the report.",
        });
      }

      // Handle image deletion based on replaceImageId
      if (replaceImageId && replaceImageId.length > 0) {
        replaceImageId.forEach((item) => {
          const imageIndex = report.listImg.findIndex(img => img._id.toString() === item);
          if (imageIndex !== -1) {
            // Delete the old image from the server
            const imagePath = path.join(UPLOAD_DIRECTORY, report.listImg[imageIndex].img);
            fs.unlink(imagePath, (err) => {
              if (err) {
                console.error(`Error deleting image: ${imagePath}`, err);
              }
            });

            // Remove the old image from the list
            report.listImg.splice(imageIndex, 1);
          }
        });
      }

      // Add new images if uploaded
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => ({ img: file.filename }));
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

    // Update other fields of the report
    Object.assign(report, updateData);

    // Save changes to DB
    const updatedReport = await report.save();

    // Update cache after saving
    const cacheIndex = cachedReports.findIndex((r) => r._id.toString() === reportId);
    if (cacheIndex !== -1) {
      cachedReports[cacheIndex] = updatedReport; // Update cache
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
    // Check if the report exists in cache first
    let report = cachedReports.find((r) => r._id.toString() === reportId);

    if (!report) {
      // If not in cache, fetch from DB
      report = await AccountReport.findById(reportId);
      if (!report) {
        return res.status(404).json({ success: false, message: "Report not found." });
      }
    }

    // Delete images from the server based on paths in listImg
    if (report.listImg && report.listImg.length > 0) {
      report.listImg.forEach((image) => {
        const imagePath = path.join(UPLOAD_DIRECTORY, image.img); // Ensure absolute path for deletion
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Error deleting image at ${imagePath}:`, err.message);
          }
        });
      });
    }

    // Delete the report document from DB
    await AccountReport.findByIdAndDelete(reportId);

    // Remove the report from cache
    cachedReports = cachedReports.filter((r) => r._id.toString() !== reportId);

    // Respond with the deleted report's information
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
