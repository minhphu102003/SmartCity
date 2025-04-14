import jwt from "jsonwebtoken";
import Account from '../../shared/models/account.js';
import AccountReport from '../../shared/models/accountReport.js';
import Role from '../../shared/models/role.js';
import { ROLES } from "../../shared/constants/role.js";


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

    const orgToken = account.tokens.find((t) => t.token === token);
    if (!orgToken) {
      return res.status(401).json({ message: "Token is expired or invalid" });
    }

    const timeDiff = (Date.now() - parseInt(orgToken.signedAt)) / 1000;
    if (timeDiff >= 86400) { 
      return res.status(401).json({ message: "Token is expired" });
    }

    next(); 
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

export const isAdmin = async (req, res, next) => {
    try {
      const account = await Account.findById(req.account_id);
      const roles = await Role.find({ _id: { $in: account.roles } });
  
      const isAdmin = roles.some(role => role.name === ROLES.ADMIN);
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
    const report = await AccountReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found." });
    }

    const account = await Account.findById(account_id);
    const roles = await Role.find({ _id: { $in: account.roles } });
    const isAdmin = roles.some(role => role.name === "admin");

    if (isAdmin) {
      return next();
    }

    const isOwner = report.account_id.toString() === account_id;

    if (isOwner) {
      const timeDifference = (Date.now() - new Date(report.timestamp).getTime()) / (1000 * 60);

      if (timeDifference > 5) {
        return res.status(403).json({
          success: false,
          message: "You cannot update this report after 5 minutes of creation.",
        });
      }

      return next();
    }

    return res.status(403).json({ success: false, message: "You do not have permission to update this report." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
