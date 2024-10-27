import jwt from "jsonwebtoken";
import Account from "../models/account.js";
import Role from "../models/role.js";


export const veriFyToken  = async(req, res, next) => {
  let token = req.headers["x-access-token"]; // Chỉnh sửa từ `req.header` thành `req.headers`

  if(!token) {
      return res.status(403).json({ message: "No token provided" });
  }

  try {
      const decoded = jwt.verify(token, process.env.SECRET); // Giải mã token
      req.account_id = decoded.id; // Gán `userId` vào request
      const account = await Account.findById(req.account_id, { password: 0 }); // Tìm user dựa trên ID, ẩn password

      if (!account) return res.status(404).json({ message: "No account found" });

      // Kiểm tra xem token có nằm trong danh sách token của user không
      let orgToken = account.tokens.find(t => t.token === token);
      if (orgToken.length == 0) {
          return res.status(401).json({ message: "Token is expired or invalid" });
      }

      next(); // Tiếp tục xử lý request nếu mọi thứ đều ổn
  } catch (err) {
      return res.status(401).json({ message: "Unauthorized!" });
  }
}


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