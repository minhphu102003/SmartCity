import CameraReport from "../models/cameraReport.js";

export const getCameraReports = async (req, res) => {
  try {
    // Get validated pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalReports = await CameraReport.countDocuments();

    // Get paginated data
    const cameraReports = await CameraReport.find()
      .populate("camera_id", "name location")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      total: totalReports,
      count: cameraReports.length,
      totalPages: Math.ceil(totalReports / limit),
      currentPage: page,
      data: cameraReports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting camera reports",
      error: error.message,
    });
  }
};

export const getCameraReportById = async (req, res) => {
  try {
    const cameraReport = await CameraReport.findById(req.params.id)
      .populate("camera_id", "name location");

    if (!cameraReport) {
      return res.status(404).json({
        success: false,
        message: "Camera report not found",
      });
    }

    res.status(200).json({
      success: true,
      data: cameraReport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting camera report",
      error: error.message,
    });
  }
}; 