import jwt from "jsonwebtoken";

import { Role, User, Account} from '../models/index.js';
import sendMail from "../services/sendMail.js";

export const signUpHandler = async(req, res ) => {
  try {
      const { username, email, password, roles } = req.body;

      const newAccount = new Account({ username,password: password})

      const newUser = new User({
          email,
          account_id: newAccount._id
      });

      if (roles) {
          const foundRoles = await Role.find({ name: { $in: roles } });
          newAccount.roles = foundRoles.map(role => role._id);
      } else {
          const role = await Role.findOne({ name: "user" });
          newAccount.roles = [role._id];
      }

      await newAccount.save();
      const savedUser = await newUser.save();

      // Populate roles with role names
      const populatedUser = await User.findById(savedUser._id).populate({
        path: "account_id",
        populate: { path: "roles", select: "name" } // Đảm bảo lấy tên role
      });

      const token = jwt.sign({ id: populatedUser.account_id._id }, process.env.SECRET, {
          expiresIn: 86400, // 24 hours
      });

      newAccount.tokens = [{ token, signedAt: Date.now().toString() }];
      await newAccount.save();

      return res.status(201).json({
          success: true,
          data: {
              username: populatedUser.account_id.username,
              email: populatedUser.email,
              roles: populatedUser.account_id.roles.map(role => role.name), // Lấy tên của role
              createdAt: populatedUser.createdAt,
              updatedAt: populatedUser.updatedAt
          }
      });
  } catch (error) {
      return res.status(500).json({ success: false, msg: error.message });
  }
}

// Sign in use email
export const signinHandler = async (req, res) => {
  try {
    const userFound = await User.findOne({ email: req.body.email }).populate({
      path: "account_id",
      populate: { path: "roles", select: "name" }
    });

    if (!userFound) return res.status(400).json({ message: "Account Not Found" });

    const matchPassword = await Account.comparePassword(req.body.password, userFound.account_id.password);
    if (!matchPassword) return res.status(401).json({ success: false, token: null, message: "Invalid Password" });
    // Lọc và làm sạch các token hết hạn
    const validTokens = (userFound.account_id.tokens || []).filter(t => {
      const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
      return timeDiff < 86400; // 1 ngày
    });

    let token;
    if (validTokens.length) {
      // Dùng token còn hiệu lực nếu có
      token = validTokens[0].token;
    } else {
      // Tạo token mới nếu không có token hợp lệ
      token = jwt.sign({ id: userFound.account_id._id }, process.env.SECRET, { expiresIn: 86400 });
      validTokens.push({ token, signedAt: Date.now().toString() });
    }

    // Cập nhật token mới cho người dùng
    await Account.findByIdAndUpdate(userFound.account_id._id, {
      tokens: validTokens // Chỉ lưu trữ token hợp lệ
    });

    // Trả về token và thông tin người dùng
    res.json({
      success: true,
      data: {
        userId: userFound._id,
        email: userFound.email,
        username: userFound.account_id.username,
        phone: userFound.phone || '',
        roles: userFound.account_id.roles.map(role => role.name),
        token: token
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const forgotHandler = async (req, res) =>{
  try{
    const email = req.body.email;
    const userFound = await User.findOne({email: email});
    if(!userFound){
      return res.status(400).json({ message: "Email not registered" });
    }
    if(!userFound.account_id){
      return res.status(400).json({ message: "User has not registered an account" });
    }
    const accountFound = await Account.findById(userFound.account_id);
    if(!accountFound){
      return res.status(404).json({ message: "Account Not Found" });
    }
    const otp =  await accountFound.setOTP();
    await sendMail({
      to: email,
      subject: 'Your OTP for register Smart City',
      html: `<p>Your OTP is: <strong>${otp}</strong></p>`
    });
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  }catch(e){
    res.status(500).json({ success: false, message: e.message || e });
  }
}

export const verifyOtpHandler = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const userFound = await User.findOne({ email });
    
    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }

    const accountFound = await Account.findById(userFound.account_id);
    if (!accountFound) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Sử dụng method validateOTP để kiểm tra OTP
    const isOtpValid = await accountFound.validateOTP(otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "OTP is invalid or expired" });
    }
    // Đánh dấu OTP đã được xác minh
    accountFound.otpVerified = true;
    await accountFound.save();

    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPasswordHandler = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }

    const accountFound = await Account.findById(userFound.account_id);
    if (!accountFound || !accountFound.otpVerified) {
      return res.status(400).json({ message: "OTP has not been verified" });
    }

    accountFound.password = newPassword;
    accountFound.otpVerified = false; // Reset the verification status
    await accountFound.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logoutHandler = async (req, res) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({ success: false, message: "Authorization fail!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.account_id = decoded.id;

    const account = await Account.findById(decoded.id, { password: 0 });
    if (!account) return res.status(404).json({ message: "No account found" });

    // Loại bỏ token đăng xuất khỏi mảng tokens
    account.tokens = account.tokens.filter((t) => t.token !== token);

    await account.save();
    res.json({ success: true, message: "Sign out successfully!" });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

export const changePasswordHandler = async (req, res) => {
  try {
    // Lấy account_id từ token đã xác thực
    const accountId = req.account_id;

    // Tìm tài khoản dựa trên accountId
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Kiểm tra mật khẩu hiện tại
    const { currentPassword, newPassword } = req.body;
    const isMatch = await Account.comparePassword(currentPassword, account.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    account.password = newPassword;
    await account.save();

    const currentToken = req.headers["x-access-token"];
    account.tokens = account.tokens.filter(t => t.token === currentToken);
    // Lưu cập nhật vào cơ sở dữ liệu
    await account.save();

    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};