import { Router } from "express";
import { 
    getListCommentByPlace, 
    getListCommentByAccount, 
    createComment,
    updateComment, 
    deleteComment 
} from "../controller/comment.controller.js";
import { veriFyToken } from "../middlewares/authJwt.js";
import {validateById, validateWithToken} from "../validations/commonField.validator.js";
import {handleValidationErrors} from "../validations/result.validator.js";
import {validateCreateComment, validateUpdateComment} from "../validations/comment.validator.js";
import {handleMultipleUploads} from "../middlewares/upload.js";

const router = Router();

router.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "X-access-token, Origin, Content-type, Accept"
    );
    next();
});

// Lấy comment dựa trên id place
router.get("/listByPlace/:id", [validateById, handleValidationErrors], getListCommentByPlace);
// Lấy comment dựa trên id user

// ? ok 
router.get("/listByAccount/:id", [validateById, handleValidationErrors], getListCommentByAccount);

// ? Test ok
router.post("/",[handleMultipleUploads], [validateWithToken, validateCreateComment, handleValidationErrors],veriFyToken, createComment);

// Chỉnh sửa comment
// ? test ok 
router.put("/:id",[handleMultipleUploads],[validateById, validateWithToken, validateUpdateComment, handleValidationErrors], veriFyToken, updateComment);
// Xóa comment
// ? test ok 
router.delete("/:id", [validateById, validateWithToken, handleValidationErrors], veriFyToken, deleteComment);

export default router;