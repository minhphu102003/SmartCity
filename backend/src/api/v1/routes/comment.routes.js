import { Router } from "express";
import { getListCommentByPlace, getListCommentByUser, createComment,updateComment, deleteComment } from "../controller/comment.controller.js";
import { veriFyToken } from "../middlewares/authJwt.js";


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
router.get("/listByPlace/:placeId", getListCommentByPlace);
// Lấy comment dựa trên id user

// ? ok 
router.get("/listByUser/:userId", getListCommentByUser);

// ? Test ok
router.post("/create",veriFyToken, createComment);

// Chỉnh sửa comment
// ? test ok 
router.put("/update/:commentId", veriFyToken, updateComment);


// Xóa comment
// ? test ok 
router.delete("/delete/:commentId", veriFyToken, deleteComment);

export default router;