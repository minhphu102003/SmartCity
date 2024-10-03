import { Router } from "express";
import { getListCommentByPlace, getListCommentByUser, createComment,updateComment, deleteComment } from "../controller/comment.controller.js";
import { veriFyToken } from "../middlewares/authJwt.js";
import {validateById, validateWithToken} from "../validations/commonField.validator.js";
import {handleValidationErrors} from "../validations/result.validator.js";
import {validateCreateComment, validateUpdateComment} from "../validations/comment.validator.js";

const router = Router();

router.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "X-access-token, Origin, Content-type, Accept"
    );
    next();
});

// ? ok
// Lấy comment dựa trên id place
router.get("/listByPlace/:Id", [validateById, handleValidationErrors], getListCommentByPlace);
// Lấy comment dựa trên id user

// ? ok 
router.get("/listByUser/:Id", [validateById, handleValidationErrors], getListCommentByUser);

// ? Test ok
router.post("/create", [validateWithToken, validateCreateComment, handleValidationErrors],veriFyToken, createComment);

// Chỉnh sửa comment
// ? test ok 
router.put("/update/:Id",[validateById, validateWithToken, validateUpdateComment, handleValidationErrors], veriFyToken, updateComment);


// Xóa comment
// ? test ok 
router.delete("/delete/:Id", [validateById, validateWithToken, handleValidationErrors], veriFyToken, deleteComment);

export default router;