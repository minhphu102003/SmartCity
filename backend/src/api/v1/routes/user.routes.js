import { Router } from "express";
import { veriFyToken,isAdmin } from '../middlewares/authJwt.js';
import { getProfile, createUser, updateUser, deleteUser } from "../controller/user.controller.js";
import { validateCreateUser,validateUpdateUser } from "../validations/user.validator.js";
import { handleValidationErrors } from "../validations/result.validator.js";
import { validateById, validateWithToken} from "../validations/commonField.validator.js";

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
router.get('/get-profile',[validateWithToken, handleValidationErrors], veriFyToken, getProfile);

// Những thông tin người dùng có thể public cho người dùng khác có thể xem
router.get('/get-profile/:Id', [validateById, handleValidationErrors], getProfile);

// ? với phân quyền admin có thể tạo người dùng hoặc thêm role cho người dùng
// ? Test xong ok
router.post('/create',[veriFyToken, isAdmin, validateCreateUser, handleValidationErrors ], createUser);


// Cập nhật thông tin của chính người dùng
// ? Test xong
router.put('/update', [validateWithToken,validateUpdateUser, handleValidationErrors, veriFyToken], updateUser); 

// Admin có thể cập nhật thông tin của bất kỳ người dùng nào
// ? Test xong 
router.put('/update/:Id', [validateById, validateUpdateUser, handleValidationErrors, veriFyToken, isAdmin], updateUser);

// Admin có thể xóa user
// ? Test xong
router.delete('/delete/:Id', [validateById, handleValidationErrors, veriFyToken, isAdmin], deleteUser);

export default router;
