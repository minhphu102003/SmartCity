import { NotificationStatus } from '../../shared/constants/notification.js';

export const formatNotification = (notification) => {
    return {
        _id: notification._id,
        title: notification.title,
        content: notification.message,
        status: notification.status,
        isRead: notification.status === NotificationStatus.READ,
        timestamp: notification.timestamp,
        distance: "",
        longitude: notification.longitude,
        latitude: notification.latitude,
        img: notification.img,
    };
};
