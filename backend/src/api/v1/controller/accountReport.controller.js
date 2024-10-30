import AccountReport from "../models/accountReport.js";
import Account from "../models/account.js";



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
      longitude: report.longitude,
      latitude: report.latitude,
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
      reports: formattedReports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAccountReportById = async (req, res) => {
  try {
    const reportId = req.params.id;

    // Tìm báo cáo và populate thông tin tài khoản
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

    // Làm phẳng dữ liệu trả về để đơn giản hóa cấu trúc
    const formattedReport = {
      reportId: report._id,
      description: report.description,
      typeReport: report.typeReport,
      congestionLevel: report.congestionLevel,
      analysisStatus: report.analysisStatus,
      longitude: report.longitude,
      latitude: report.latitude,
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
    const { description, typeReport, congestionLevel, longitude, latitude } =
      req.body;
    const account_id = req.account_id;
    // Lấy đường dẫn của file đã upload từ `multer`
    const uploadedImages = req.files.map((file) => ({ img: file.path }));

    // Tạo một báo cáo mới với dữ liệu từ client và đường dẫn của ảnh đã upload
    const newReport = new AccountReport({
      account_id,
      description,
      typeReport,
      congestionLevel,
      longitude,
      latitude,
      listImg: uploadedImages,
    });

    await newReport.save();

    // ? Khi tạo xong cần gửi lên kafka để xử lý tiếp nì

    res.status(201).json({ success: true, data: newReport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateAccountReport = async (req, res) => {
  const reportId = req.params.id;
  const updateData = { ...req.body }; // Tạo một bản sao để sửa đổi

  try {
    // Kiểm tra nếu báo cáo tồn tại
    const report = await AccountReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found." });
    }

    // Bỏ các trường không được phép cập nhật
    delete updateData.timestamp;
    delete updateData.longitude;
    delete updateData.latitude;
    delete updateData.listImg;

    // Cập nhật báo cáo với các trường hợp lệ
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
    // Tìm báo cáo theo ID
    const report = await AccountReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found." });
    }

    // Xóa báo cáo
    await AccountReport.findByIdAndDelete(reportId);

    // Trả về thông tin của báo cáo đã xóa
    res.status(200).json({
      success: true,
      message: "Report deleted successfully.",
      report: {
        reportId: report._id,
        description: report.description,
        typeReport: report.typeReport,
        congestionLevel: report.congestionLevel,
        analysisStatus: report.analysisStatus,
        longitude: report.longitude,
        latitude: report.latitude,
        timestamp: report.timestamp,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        accountId: report.account_id,
        // Nếu bạn cần thêm thông tin khác, hãy thêm ở đây
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};