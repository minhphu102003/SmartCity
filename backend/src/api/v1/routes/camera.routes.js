import {Router} from 'express';
import {veriFyToken, isAdmin} from "../middlewares/authJwt.js";
import {getListCamera, createCamera, updateCamera, deleteCamera} from "../controller/camera.controller.js";
import {validateById, validateWithToken} from "../validations/commonField.validator.js";
import {handleValidationErrors} from "../validations/result.validator.js";
import { validateCreateCamera, validateUpdateCamera, getListCameraValidator } from '../validations/camera.validator.js';

const router = Router();

const adminAuthMiddlewares = [validateWithToken, handleValidationErrors, veriFyToken, isAdmin];

router.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "X-access-token, Origin, Content-type, Accept"
    );
    next();
});

// Lấy danh sách router từ admin
//  ?limit&page
//  ? test ok
router.get("/list", [getListCameraValidator, ...adminAuthMiddlewares], getListCamera);


// Tạo mới một camera từ admin
// ? test ok
router.post('/create', [validateCreateCamera, ...adminAuthMiddlewares], createCamera);

// Cập nhật camera từ admin
// ? test ok 
router.put("/update/:Id", [validateById, validateUpdateCamera, ...adminAuthMiddlewares], updateCamera);

// Xóa camera từ admin
// ? test ok
router.delete("/delete/:Id", [validateById, ...adminAuthMiddlewares], deleteCamera);

export default router;