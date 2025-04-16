import jwt from "jsonwebtoken";
import Account from "../models/account.js";
import User from "../models/user.js";

export const handleLocationUpdate = async (data) => {
  try {
    let account_id = null;

    if (data.token) {
      try {
        const decoded = jwt.verify(data.token, process.env.SECRET);
        account_id = decoded.id;

        const account = await Account.findById(account_id, { password: 0 });
        if (!account) {
          return { status: 404, message: "No account found" };
        }

        const orgToken = account.tokens.find((t) => t.token === data.token);
        if (!orgToken) {
          return { status: 401, message: "Token is expired or invalid" };
        }

        const timeDiff = (Date.now() - parseInt(orgToken.signedAt)) / 1000;
        if (timeDiff >= 86400) {
          return { status: 401, message: "Token is expired" };
        }
      } catch (error) {
        console.log("Token is invalid or expired, proceeding without account_id");
      }
    }

    let user;
    if (account_id) {
      user = await User.findOne({ account_id }); // Tìm kiếm người dùng theo account_id
    }

    if (!user) {
      user = await User.findOne({ uniqueId: data.uniqueid });

      if (!user) {
        user = new User({
          uniqueId: data.uniqueid,
          latitude: data.latitude,
          longitude: data.longitude,
          account_id: account_id || null, // Nếu có token, gán account_id
        });
        await user.save();
        console.log("New user created with location");
      }
    } else {
      // Nếu tìm thấy người dùng qua account_id, cập nhật thông tin vị trí
      user.latitude = data.latitude;
      user.longitude = data.longitude;
      console.log("Location updated for existing user");
    }

    // Cập nhật thông tin người dùng
    await user.save();
    return { status: 200, message: "Location update processed successfully" };

  } catch (error) {
    console.error("Error processing location update:", error);
    return { status: 500, message: "Internal Server Error" };
  }
};
