import fs from "fs";

import { Comment, Place} from '../models/index.js';
import {UPLOAD_DIRECTORY} from "../constants/uploadConstants.js";

const PRODUCE_TOPIC = process.env.PRODUCE_TOPIC || 'express-topic';

const updatePlaceStar = async (place_id) => {
    try {
        const comments = await Comment.find({ place_id });
        const totalStars = comments.reduce((acc, comment) => acc + comment.star, 0);
        const averageStar = comments.length > 0 ? totalStars / comments.length : 0;
        const roundedAverageStar = parseFloat(averageStar.toFixed(1));
        const updatedPlace = await Place.findByIdAndUpdate(
            place_id,
            { star: roundedAverageStar  },
            { new: true } // Trả về document đã được cập nhật
        );
        if (!updatedPlace) {
            console.error(`Place with ID ${place_id} not found.`);
            return;
        }
        const messageObject = {
            place_id,
            roundedAverageStar ,
            updatedAt: new Date() // Gửi thêm timestamp cập nhật (nếu cần)
        };
        // produceMessage(PRODUCE_TOPIC, messageObject, "update-star");

        console.log(`Place ${place_id} star rating updated and sent to Kafka.`);
    } catch (error) {
        console.error('Error updating place star rating:', error);
    }
};

const formatComment = (comment) => {
    const { account_id, ...rest } = comment.toObject();
    return {
        ...rest,
        account_id: account_id._id,
        username: account_id.username,
    };
};


export const getListCommentByPlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Tìm tất cả các comment theo place_id
        const comments = await Comment.find({ place_id: id })
            .populate("account_id", "username")
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
        const formatComments = comments.map(formatComment);

        return res.status(200).json({
            success: true,
            total: totalComments, // Tổng số bình luận
            count: comments.length,
            totalPages: Math.ceil(totalComments / limit), // Tổng số trang
            currentPage: parseInt(page), // Trang hiện tại
            data : formatComments // Danh sách bình luận
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
            .populate("account_id", "username")
            .populate("place_id", "name type star img") 
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
        const formatComments = comments.map(formatComment);

        return res.status(200).json({
            success: true,
            total: totalComments, 
            count: comments.length,// Tổng số bình luận của user
            totalPages: Math.ceil(totalComments / limit), // Tổng số trang
            currentPage: parseInt(page), // Trang hiện tại
            data: formatComments
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
        const uploadedImages = Array.isArray(req.body.uploadedImages)
        ? req.body.uploadedImages.map((url) => ({ image: url }))
        : [];
        // Create a new comment
        const newComment = new Comment({
            star,
            content,
            account_id, // Assign account_id from token
            place_id,
            listImg: uploadedImages, // Assign list of images
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
        updatePlaceStar(deletedComment.place_id).catch(err => {
            console.error("Error updating place star:", err);
        });
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
