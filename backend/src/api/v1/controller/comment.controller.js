import fs from "fs";
import path from "path";
import Comment from "../models/comment.js";
import Place from "../models/place.js";
import {UPLOAD_DIRECTORY} from "../constants/uploadConstants.js";

const updatePlaceStar = async (place_id) => {
    const comments = await Comment.find({ place_id }); // Fetch all comments for the place
    const totalStars = comments.reduce((acc, comment) => acc + comment.star, 0);
    const averageStar = comments.length > 0 ? totalStars / comments.length : 0;

    await Place.findByIdAndUpdate(place_id, { star: averageStar }); // Update the place with the new average star rating
};

export const getListCommentByPlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Tìm tất cả các comment theo place_id
        const comments = await Comment.find({ place_id: id })
            .populate("account_id", "username") // Lấy thông tin username từ account
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .exec();

        const totalComments = await Comment.countDocuments({ place_id: id }); // Tổng số bình luận cho địa điểm này

        if (!comments || comments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No comments found for this place.",
            });
        }

        return res.status(200).json({
            success: true,
            totalComments, // Tổng số bình luận
            totalPages: Math.ceil(totalComments / limit), // Tổng số trang
            currentPage: parseInt(page), // Trang hiện tại
            data : comments // Danh sách bình luận
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const getListCommentByAccount = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Tìm tất cả các comment theo account_id
        const comments = await Comment.find({ account_id: id })
            .populate("place_id", "name") // Lấy thông tin tên địa điểm từ place
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .exec();

        const totalComments = await Comment.countDocuments({ account_id: id }); // Tổng số bình luận của user

        if (!comments || comments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No comments found for this user.",
            });
        }

        return res.status(200).json({
            success: true,
            totalComments, // Tổng số bình luận của user
            totalPages: Math.ceil(totalComments / limit), // Tổng số trang
            currentPage: parseInt(page), // Trang hiện tại
            data: comments
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
        const { star, content, place_id } = req.body; // Remove images from body since they are in req.files
        const account_id = req.account_id; // Retrieve account_id from the authenticated token

        // Check if place_id exists
        const placeExists = await Place.findById(place_id);

        if (!placeExists) {
            return res.status(404).json({
                success: false,
                message: "Place not found",
            });
        }

        // Convert uploaded images to an array of imageCommentSchema objects
        const listImg = req.files?.map((file) => ({ image: file.filename })) || []; // Use filename for the stored image

        // Create a new comment
        const newComment = new Comment({
            star,
            content,
            account_id, // Assign account_id from token
            place_id,
            listImg, // Assign list of images
        });

        // Save the comment to the database
        const savedComment = await newComment.save();

        updatePlaceStar(place_id).catch(err => {
            console.error("Error updating place star:", err);
        });

        return res.status(201).json({
            success: true,
            message: "Comment created successfully",
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
        const { id } = req.params; // Comment ID from URL
        const { star, content, replaceImageId } = req.body; // Data to be updated
        const account_id = req.account_id; // Retrieve account_id from token

        // Find the comment to be updated
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        // Check comment ownership
        if (comment.account_id.toString() !== account_id) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to edit this comment",
            });
        }

        // Update fields
        if (star !== undefined) comment.star = star;
        if (content !== undefined) comment.content = content;

        // Handle images: if new images are uploaded
        if (replaceImageId && replaceImageId.length > 0) {
            // Xóa các hình ảnh cũ dựa trên replaceImageId
            replaceImageId.forEach((item) => {
                const imageIndex = comment.listImg.findIndex(img => img._id.toString() === item);
                if (imageIndex !== -1) {
                    // Delete the old image from the server
                    fs.unlink(UPLOAD_DIRECTORY + comment.listImg[imageIndex].image, (err) => {
                        if (err) {
                            console.error(`Error deleting image: ${comment.listImg[imageIndex]}`, err);
                        }
                    });

                    // Xóa hình ảnh cũ khỏi danh sách
                    comment.listImg.splice(imageIndex, 1);
                }
            });
        }

        // Thêm các hình ảnh mới nếu có
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({ image: file.filename }));
            comment.listImg.push(...newImages); // Append new images to the list
        }

        // Save changes
        const updatedComment = await comment.save();
        
        updatePlaceStar(comment.place_id).catch(err => {
            console.error("Error updating place star:", err);
        });


        return res.status(200).json({
            success: true,
            message: "Comment updated successfully",
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
        const { id } = req.params; // Comment ID from URL
        const account_id = req.account_id; // Retrieve account_id from token

        // Find the comment to be deleted
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        // Check comment ownership
        if (comment.account_id.toString() !== account_id) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to delete this comment",
            });
        }

        // Delete images from the server
        if (comment.listImg && comment.listImg.length > 0) {
            comment.listImg.forEach(imageObj => {
                const imagePath = imageObj.image; // Assuming imageObj.image is the absolute path
                fs.unlink(UPLOAD_DIRECTORY + imagePath, (err) => {
                    if (err) {
                        console.error(`Error deleting image: ${imagePath}`, err);
                    }
                });
            });
        }

        // Delete the comment and return the deleted data
        const deletedComment = await Comment.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
            data: deletedComment,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
