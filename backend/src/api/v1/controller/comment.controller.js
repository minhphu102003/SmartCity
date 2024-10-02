import Comment from "../models/comment.js";
import User from "../models/user.js";
import Place from "../models/place.js";

export const getListCommentByPlace = async (req, res, next) => {
    try {
        const { placeId } = req.params;

        // Tìm tất cả các comment theo place_id
        const comments = await Comment.find({ place_id: placeId })
            .populate("user_id", "username")  // Populate thông tin user_id nếu cần
            .exec();

        if (!comments || comments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No comments found for this place.",
            });
        }

        return res.status(200).json({
            success: true,
            data: comments,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


export const getListCommentByUser = async (req, res, next) => {
    try {
        const {userId} = req.params;

        // Tìm tất cả các comment theo user_id
        const comments = await Comment.find({ user_id: userId })
            .populate("place_id", "name")  // Populate thông tin place_id nếu cần
            .exec();

        if (!comments || comments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No comments found for this user.",
            });
        }

        return res.status(200).json({
            success: true,
            data: comments,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const createComment = async (req, res, next) => {
    try {
        const { star, content, place_id, image } = req.body;
        const user_id = req.userId;  // Lấy userId từ token đã xác thực
        console.log('hay');
        // Kiểm tra xem place_id có tồn tại không
        const placeExists = await Place.findById(place_id);

        if (!placeExists) {
            return res.status(404).json({
                success: false,
                message: "Place không tồn tại",
            });
        }

        // Tạo comment mới
        const newComment = new Comment({
            star,
            content,
            user_id,   // Gán userId lấy từ token
            place_id,
            image,
        });

        // Lưu comment vào cơ sở dữ liệu
        const savedComment = await newComment.save();

        return res.status(201).json({
            success: true,
            message: "Comment đã được tạo thành công",
            data: savedComment,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


export const updateComment = async (req, res, next) => {
    try {
        const { commentId } = req.params; // ID của comment từ URL
        const { star, content, image } = req.body; // Dữ liệu cần chỉnh sửa
        const userId = req.userId; // Lấy userId từ token

        // Tìm comment cần chỉnh sửa
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment không tồn tại",
            });
        }

        // Kiểm tra quyền sở hữu comment
        if (comment.user_id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền chỉnh sửa comment này",
            });
        }

        // Cập nhật dữ liệu
        if (star !== undefined) comment.star = star;
        if (content !== undefined) comment.content = content;
        if (image !== undefined) comment.image = image;

        // Lưu lại các thay đổi
        const updatedComment = await comment.save();

        return res.status(200).json({
            success: true,
            message: "Comment đã được cập nhật",
            data: updatedComment,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


export const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params; // ID của comment từ URL
        const userId = req.userId; // Lấy userId từ token

        // Tìm comment cần xóa
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment không tồn tại",
            });
        }

        // Kiểm tra quyền sở hữu comment
        if (comment.user_id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền xóa comment này",
            });
        }

        // Xóa comment
        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({
            success: true,
            message: "Comment đã được xóa",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
