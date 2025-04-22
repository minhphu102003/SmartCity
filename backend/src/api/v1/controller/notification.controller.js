import { Notification } from '../models/index.js';
import { NotificationStatus } from '../../shared/constants/index.js';
import { formatNotification } from '../utils/notificationUtils.js';
import {produceMessage} from "../../../kafkaOnline.config.js";

const PRODUCE_TOPIC = process.env.KAFKA_TOPIC_PRODUCER || 'express-topic';
const DEMO_TOPIC = process.env.KAFKA_TOPIC_CONSUMER || 'python-topic';

export const getListNotificationByAccount = async (req, res, next) => {
    try {
        const accountId = req.account_id; 
        const { page = 1, limit = 10 } = req.query;

        const notifications = await Notification.find({ account_id: accountId })
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .exec();
        const totalNotifications = await Notification.countDocuments({ account_id: accountId });

        if (!notifications || notifications.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No notifications found for this account.",
            });
        }

        const formattedNotifications = notifications.map(formatNotification);

        return res.status(200).json({
            success: true,
            total: totalNotifications, 
            count: notifications.length, 
            totalPages: Math.ceil(totalNotifications / limit), 
            currentPage: parseInt(page), 
            data: formattedNotifications,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


export const createNotification = async (req, res) => {
    try {
      const {title, message, longitude, latitude } = req.body;
      const account_id = req.account_id;
  
      const notification = new Notification({
        account_id,
        title,
        message,
        longitude,
        latitude,
        img: req.body.uploadedImage || null,
        status: NotificationStatus.PENDING,
      });
  
      await notification.save();
  
      produceMessage(DEMO_TOPIC, formatNotification(notification), "create notification");
  
      return res.status(201).json({
        success: true,
        message: "Notification created successfully",
        data: formatNotification(notification),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const updateNotification = async (req, res) => {
    try {
        const { notification_id } = req.params;
        const {title, message, longitude, latitude, img, status } = req.body;

        const notification = await Notification.findById(notification_id);
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }
        notification.title = title || notification.title;
        notification.message = message || notification.message;
        notification.longitude = longitude || notification.longitude;
        notification.latitude = latitude || notification.latitude;
        notification.img = img || notification.img;
        if (status) notification.status = status;

        await notification.save();

        return res.status(200).json({
            success: true,
            message: "Notification updated successfully",
            data: formatNotification(notification),
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const { notification_id } = req.params;

        const notification = await Notification.findById(notification_id);
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }
        await Notification.findByIdAndDelete(notification_id);

        return res.status(200).json({ success: true, message: "Notification deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}