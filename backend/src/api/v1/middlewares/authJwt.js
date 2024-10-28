import jwt from "jsonwebtoken";
import Account from "../models/account.js";
import Role from "../models/role.js";


export const veriFyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.account_id = decoded.id;
    console.log(decoded.id);
    const account = await Account.findById(req.account_id, { password: 0 });
    console.log(account);
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