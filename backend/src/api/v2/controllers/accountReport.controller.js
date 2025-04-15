import { createAccountReportV2, getAccountReports, getAccountReportById } from "../services/accountReport.service.js";
import { MediaTypes } from '../constants/mediaType.js';
import { getPaginationData } from "../../shared/utils/pagination.js";
import { buildQuery, formatReport } from "../utils/reportUtils.js";
import { produceMessage } from "../../../kafkaOnline.config.js";
import { EXTRACT_IMAGE_TOPIC } from "../constants/kafka.js";

export const createAccountReportV2Controller = async (req, res) => {
  try {
    const {
      description,
      typeReport,
      timestamp,
      congestionLevel,
      analysisStatus,
      longitude,
      latitude,
      roadSegment_ids,
    } = req.body;

    const location = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };

    const newReport = await createAccountReportV2({
      account_id: req.account_id,
      description,
      typeReport,
      timestamp,
      congestionLevel,
      analysisStatus,
      location,
      roadSegment_ids,
      media_files: req.body.uploadedVideo
        ? {
            media_url: req.body.uploadedVideo,
            media_type: MediaTypes.VIDEO,
          }
        : undefined,
    });

    produceMessage(EXTRACT_IMAGE_TOPIC, newReport._doc, 'user report video');

    return res.status(201).json({
      success: true,
      message: "Report with video created successfully",
      data: newReport,
    });
  } catch (err) {
    console.error("Create report error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create report",
    });
  }
};

export const getAccountReportsController = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;

    const { skip, limit: perPage, currentPage } = getPaginationData({ page, limit });

    const query = buildQuery(filters);

    const { reports, totalReports } = await getAccountReports(query, skip, perPage);

    const formattedReports = reports.map((report) => formatReport(report));

    res.status(200).json({
      success: true,
      total: totalReports,
      count: formattedReports.length,
      totalPages: Math.ceil(totalReports / perPage),
      currentPage,
      data: formattedReports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAccountReportByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await getAccountReportById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const formattedReport = formatReport(report);

    return res.status(200).json({
      success: true,
      data: formattedReport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};