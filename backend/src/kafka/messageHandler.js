import CameraReport from '../api/v1/models/cameraReport.js';
import User from '../api/v1/models/user.js';
import Notification from '../api/v1/models/notification.js';
import { NotificationStatus } from '../api/shared/constants/notification.js';
import { calculateDistance } from '../api/v1/services/distance.js';
import { buildNotificationMessage } from '../api/shared/utils/notification.js';

export const handleKafkaMessage = async (data, sendMessageToFrontend) => {
  const { type, latitude, camera_id, longitude, account_id, typeReport, trafficVolume, timestamp, congestionLevel, img, description } = data;

  if (type === 'camera report') {
    const report = new CameraReport({ camera_id, trafficVolume, congestionLevel, typeReport, img, timestamp });
    await report.save();
    const notificationMessage = buildNotificationMessage(type, typeReport, description, timestamp, latitude, longitude, img);
    sendMessageToFrontend(notificationMessage);
  } else if (type === 'user report') {
    const notificationMessage = buildNotificationMessage(type, typeReport, description, timestamp, latitude, longitude, img);
    sendMessageToFrontend(notificationMessage);

    const reportTypeMap = {
      'TRAFFIC_JAM': 'Traffic Jam',
      'FLOOD': 'Flood',
      'ACCIDENT': 'Accident',
      'ROADWORK': 'Road Work',
    };

    const typeDescription = reportTypeMap[typeReport] || 'Unknown';
    const allUsers = await User.find({ latitude: { $exists: true }, longitude: { $exists: true } });
    const usersInRange = allUsers.filter((user) => calculateDistance(latitude, longitude, user.latitude, user.longitude) <= 10);
    for (const user of usersInRange) {
      if (user.account_id) {
        const notification = new Notification({
          account_id: user.account_id,
          message: `${typeDescription} reported near you: ${description}`,
          longitude,
          latitude,
          img,
          status: NotificationStatus.PENDING,
        });
        await notification.save();
      }
    }
  } else if (type === 'create notification') {
    const { type, ...notification } = data;
    notification.typeReport = 'create notification';
    sendMessageToFrontend(notification);
  }
};