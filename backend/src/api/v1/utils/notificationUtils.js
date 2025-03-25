import { NotificationStatus } from '../../shared/constants/notification.js';

export const formatNotification = (notification) => {
    let title;
    if (notification.message.startsWith('T')) {
        title = 'Traffic jam notification';
    } else if (notification.message.startsWith('F')) {
        title = 'Flood notification';
    } else if (notification.message.startsWith('A')) {
        title = 'Accident notification';
    } else {
        title = 'Road Work Notification';
    }

    return {
        title,
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
