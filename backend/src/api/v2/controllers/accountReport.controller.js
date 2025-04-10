import { createAccountReportV2 } from "../services/accountReport.service.js";
import { MediaTypes } from '../constants/mediaType.js';

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
