import jwt from "jsonwebtoken";
import Account from "../models/account.js";
import Role from "../models/role.js";
import AccountReport from "../models/accountReport.js";
import role from "../models/role.js";


export const veriFyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.account_id = decoded.id;
    const account = await Account.findById(req.account_id, { password: 0 });
    if (!account) {
      return res.status(404).json({ message: "No account found" });
    }

    // Kiểm tra xem token có nằm trong danh sách token của user không
    const orgToken = account.tokens.find((t) => t.token === token);
    if (!orgToken) {
      return res.status(401).json({ message: "Token is expired or invalid" });
    }

    // Kiểm tra thời gian hết hạn của token
    const timeDiff = (Date.now() - parseInt(orgToken.signedAt)) / 1000;
    if (timeDiff >= 86400) { // 1 ngày
      return res.status(401).json({ message: "Token is expired" });
    }

    next(); // Tiếp tục xử lý request nếu mọi thứ đều ổn
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

export const isAdmin = async (req, res, next) => {
    try {
      const account = await Account.findById(req.account_id);
      const roles = await Role.find({ _id: { $in: account.roles } });
  
      const isAdmin = roles.some(role => role.name === "admin");
      if (isAdmin) return next();
  
      return res.status(403).json({ message: "Require Admin Role!" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error });
    }
};


// ? Code này vẫn chưa tận dụng được hàm isAdmin ở trên và dùng return first 
// ? Đang bị lỗi return nhiều res nếu sử dụng lại, cũng chả biết sao nữa 
export const isAdminOrOwner = async (req, res, next) => {
  const reportId = req.params.id;
  const account_id = req.account_id;

  try {
    // Tìm báo cáo theo ID
    const report = await AccountReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found." });
    }

    // Kiểm tra vai trò của tài khoản
    const account = await Account.findById(account_id);
    const roles = await Role.find({ _id: { $in: account.roles } });
    const isAdmin = roles.some(role => role.name === "admin");

    // Nếu là admin, cho phép tiếp tục
    if (isAdmin) {
      return next();
    }

    // Nếu không phải admin, kiểm tra nếu là owner
    const isOwner = report.account_id.toString() === account_id;

    if (isOwner) {
      const timeDifference = (Date.now() - new Date(report.timestamp).getTime()) / (1000 * 60);

      // Giới hạn cập nhật sau 5 phút
      if (timeDifference > 5) {
        return res.status(403).json({
          success: false,
          message: "You cannot update this report after 5 minutes of creation.",
        });
      }

      return next();
    }

    // Không phải admin cũng không phải owner
    return res.status(403).json({ success: false, message: "You do not have permission to update this report." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
