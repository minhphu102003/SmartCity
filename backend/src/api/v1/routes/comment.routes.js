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
// import {handleMultipleUploads} from "../middlewares/upload.js";
import {handleMultipleUploads} from "../services/cloudinary.service.js";

const router = Router();

router.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "X-access-token, Origin, Content-type, Accept"
    );
    next();
});

router.get("/listByPlace/:id", [validateById], getListCommentByPlace);
router.get("/listByAccount/:id", [validateById], getListCommentByAccount);
router.post("/",[handleMultipleUploads], [validateWithToken, validateCreateComment],veriFyToken, createComment);
router.put("/:id",[handleMultipleUploads],[validateById, validateWithToken, validateUpdateComment], veriFyToken, updateComment);
router.delete("/:id", [validateById, validateWithToken], veriFyToken, deleteComment);

router.use(handleValidationErrors);

export default router;