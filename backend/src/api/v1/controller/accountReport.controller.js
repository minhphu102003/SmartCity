import fs from 'fs';
import path from 'path';
import AccountReport from "../models/accountReport.js";
import Account from "../models/account.js";
import {UPLOAD_DIRECTORY} from "../constants/uploadConstants.js";



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
      accountId: report.account_id._id,
      username: report.account_id.username,
      roles: report.account_id.roles.map(role => role.name),
    }));

    res.status(200).json({
      success: true,
      totalReports,
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
        .json({ success: false, message: "Báo cáo không tồn tại" });
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

    // Get file paths from uploaded images using multer
    const uploadedImages = req.files.map((file) => ({ img: file.filename }));

    // Create a new report with data from client and uploaded images
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
    });

    await newReport.save();

    // Optionally send the report to Kafka for further processing

    res.status(201).json({ success: true, data: newReport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAccountReport = async (req, res) => {
  const reportId = req.params.id;
  const updateData = { ...req.body }; // Create a copy of req.body for modifications

  try {
    // Check if the report exists
    const report = await AccountReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found." });
    }

    // Remove fields that are not allowed to be updated
    delete updateData.timestamp;
    delete updateData.location;
    delete updateData.listImg;

    // Update the report with only the allowed fields
    const updatedReport = await AccountReport.findByIdAndUpdate(reportId, updateData, {
      new: true,
    });

    res.status(200).json({ success: true, data: updatedReport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteAccountReport = async (req, res) => {
  const reportId = req.params.id;

  try {
    // Find the report by ID
    const report = await AccountReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found." });
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

    // Delete the report document from the database
    await AccountReport.findByIdAndDelete(reportId);

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