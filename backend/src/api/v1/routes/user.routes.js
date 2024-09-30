import { Router } from "express";
import { veriFyToken,isAdmin } from '../middlewares/authJwt.js';
import { getProfile, createUser, updateUser, deleteUser } from "../controller/user.controller.js";

const router = Router();

// Xử lý header CORS
router.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

// Route lấy thông tin profile, cần xác thực bằng JWT
router.get('/get-profile', veriFyToken, getProfile);

// ? với phân quyền admin có thể tạo người dùng hoặc thêm role cho người dùng
// ? Test xong ok
router.post('/create',[veriFyToken,isAdmin], createUser);


// Cập nhật thông tin của chính người dùng
// ? Test xong
router.put('/update', veriFyToken, updateUser); 

// Admin có thể cập nhật thông tin của bất kỳ người dùng nào
// ? Test xong 
router.put('/update/:userId', [veriFyToken,isAdmin], updateUser);

// Admin có thể xóa user
// ? Test xong
router.delete('/delete/:userId', [veriFyToken, isAdmin], deleteUser);

export default router;
