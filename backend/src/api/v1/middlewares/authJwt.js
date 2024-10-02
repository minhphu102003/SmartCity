import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Role from "../models/role.js";


export const veriFyToken  = async(req, res, next) => {
  let token = req.headers["x-access-token"]; // Chỉnh sửa từ `req.header` thành `req.headers`

  if(!token) {
      return res.status(403).json({ message: "No token provided" });
  }

  try {
      const decoded = jwt.verify(token, process.env.SECRET); // Giải mã token
      req.userId = decoded.id; // Gán `userId` vào request
      const user = await User.findById(req.userId, { password: 0 }); // Tìm user dựa trên ID, ẩn password

      if (!user) return res.status(404).json({ message: "No user found" });

      // Kiểm tra xem token có nằm trong danh sách token của user không
      let orgToken = user.tokens.filter(t => t.token === token);
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
      const user = await User.findById(req.userId);
      const roles = await Role.find({ _id: { $in: user.roles } });
  
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
  
      return res.status(403).json({ message: "Require Admin Role!" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error });
    }
};