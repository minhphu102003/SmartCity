import user from "../models/user.js";
import Role from "../models/role.js";
import jwt from "jsonwebtoken";

export const getProfile = async (req, res, next) => {
    try {
        const id = req.userId; // Lấy ID từ token đã được giải mã
        const {userId} = req.params;

        const findId = id || userId;

        //? ẩn đi những thông tin nhạy cảm 
        const findUser = await user.findOne({ _id: findId }).select('-_id -password -tokens -roles -createdAt -updatedAt');

        if (!findUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: findUser
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export const createUser = async (req, res, next) => {
    try {
        const { username, email, password, roles } = req.body;

        const newUser = new user({
            username,
            email,
            password
        });

        if (roles) {
            const foundRoles = await Role.find({ name: { $in: roles } });
            newUser.roles = foundRoles.map((role) => role._id);
        } else {
            const role = await Role.findOne({ name: "user" });
            newUser.roles = [role._id];
        }

        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id }, process.env.SECRET, {
            expiresIn: 86400,
        });

        newUser.tokens = [{ token, signedAt: Date.now().toString() }];
        await newUser.save();

        // Chuyển dữ liệu về dạng thuần và xóa các trường nhạy cảm
        const userResponse = savedUser.toObject();
        delete userResponse.password;
        delete userResponse.tokens;
        delete userResponse.roles;
        delete userResponse._id;
        delete userResponse.createdAt;
        delete userResponse.updatedAt;

        return res.status(200).json({ success: true, data: userResponse });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// ? Thiếu nếu user tự cập nhật thì không thể cho role lên admin
//  Thông tin trả về nên xóa các trường nhạy cảm

export const updateUser = async (req, res, next) => {
    try {
        const { userId } = req.params; // Lấy userId từ params nếu admin cập nhật
        const currentUserId = req.userId; // Lấy userId từ token nếu người dùng tự cập nhật
        const idToUpdate = userId || currentUserId; // Chọn ID để cập nhật

        // Tìm user cần cập nhật
        const userFound = await user.findById(idToUpdate);

        if (!userFound) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Các trường thông tin có thể cập nhật
        const { username, email, password, roles } = req.body;

        // Cập nhật username và email nếu có
        if (username) userFound.username = username;
        if (email) userFound.email = email;

        if(password) userFound.password = password;

        // Nếu cập nhật roles, tìm và gán role ID
        if (roles) {
            const foundRoles = await Role.find({ name: { $in: roles } });
            userFound.roles = foundRoles.map((role) => role._id);
        }

        // Lưu lại thông tin người dùng đã được cập nhật
        const updatedUser = await userFound.save();

        return res.status(200).json({
            success: true,
            message: "User information updated successfully",
            data: updatedUser,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// ! Nên ẩn những thông tin nhạy cảm 
export const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params; // Lấy userId từ params

        // Tìm người dùng theo userId
        const userFound = await user.findById(userId);
        

        // Kiểm tra nếu không tìm thấy người dùng
        if (!userFound) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const userResponse = userFound.toObject();

        delete userResponse.password;
        delete userResponse.tokens;
        delete userResponse.roles;
        delete userResponse._id;
        delete userResponse.createdAt;
        delete userResponse.updatedAt;

        // Xóa người dùng
        await user.findByIdAndDelete(userId);

        // Trả về thông tin người dùng đã bị xóa
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: userFound // Trả về thông tin người dùng bị xóa
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
