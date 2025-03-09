import { Notification } from '../models';
import { NotificationStatus } from '~/shared/constants';

export const getListNotificationByAccount = async (req, res, next) => {
    try {
        const accountId = req.account_id; // Lấy account_id từ params
        const { page = 1, limit = 10 } = req.query; // Lấy page và limit từ query

        // Tìm tất cả các notification theo account_id, sắp xếp theo thời gian (timestamp)
        const notifications = await Notification.find({ account_id: accountId })
            .sort({ timestamp: -1 }) // Sắp xếp theo thời gian giảm dần
            .skip((page - 1) * limit) // Bỏ qua các notification trước đó dựa trên page
            .limit(parseInt(limit)) // Giới hạn số lượng notification
            .exec();

        // Tính tổng số notification của account này
        const totalNotifications = await Notification.countDocuments({ account_id: accountId });

        if (!notifications || notifications.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No notifications found for this account.",
            });
        }

        // Chuyển đổi dữ liệu sang định dạng tương ứng với frontend
        const formattedNotifications = notifications.map(notification => {
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
                title: title, // Set title based on the condition
                content: notification.message, // Cũng có thể sử dụng message cho content, tùy thuộc vào yêu cầu
                status: notification.status, // Giữ nguyên status
                isRead: notification.status === NotificationStatus.READ, // Giả sử status "COMPLETED" là đã đọc
                timestamp: notification.timestamp, // Thời gian notification
                distance: "", // Thêm logic tính khoảng cách nếu cần
                longitude: notification.longitude, // Kinh độ
                latitude: notification.latitude, // Vĩ độ
                img: notification.img, // Đường dẫn hình ảnh
            };
        });

        return res.status(200).json({
            success: true,
            total: totalNotifications, // Tổng số notification
            count: notifications.length, // Số lượng notification hiện tại
            totalPages: Math.ceil(totalNotifications / limit), // Tổng số trang
            currentPage: parseInt(page), // Trang hiện tại
            data: formattedNotifications, // Danh sách notification đã chuyển đổi
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};