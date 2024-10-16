import { Router } from "express";
import {veriFyToken} from "../middlewares/authJwt.js";
import { createHistory, getListHistory, deleteHistory } from "../controller/history.controller.js";
import {handleValidationErrors} from "../validations/result.validator.js";
import {createHistoryValidator, getListHistoryValidator, deleteHistoryValidator} from "../validations/history.validator.js";
import {validateWithToken} from "../validations/commonField.validator.js";

const router = Router();

const validatorMiddleware = [validateWithToken, handleValidationErrors, veriFyToken];

router.use((req, res, next) =>{
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

// ? test ok
// Router lấy thông tin lịch sử tìm kiếm của người dùng
router.get('/list',[getListHistoryValidator, ...validatorMiddleware], getListHistory);

// Router tạo thông tin tìm kiếm của người dùng
// ? Test ok

// ? Người dùng không đăng nhập vẫn có thể tìm kiếm được mà  ??
//  ! Như thế access Token valid thì nó lại vô lý và ta cần một kho lưu trữ gì đó dù
//  ! Người sử dụng không đăng nhập vẫn có thể lưu lịch sử tìm kiếm của họ trên thiết bị 
router.post('/',[createHistoryValidator, ...validatorMiddleware], createHistory);

// Router xóa thông tim lịch sử tìm kiếm của người dùng
// ? Test ok

router.delete('/', [deleteHistoryValidator, ...validatorMiddleware],  deleteHistory);

// ? Có thể nâng cấp lên xóa trong một khoảng thời gian nào đó 

// ? Xóa toàn bộ 

export default router;
