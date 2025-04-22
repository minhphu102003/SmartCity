import CameraReport from '../api/v1/models/cameraReport.js';
import { buildNotificationMessage } from '../api/shared/utils/notification.js';
import { notifyUsersInRange } from '../api/shared/utils/notifyUsersInRange.js';

export const handleKafkaMessage = async (data, sendMessageToFrontend) => {
  const {
    type,
    latitude,
    camera_id,
    longitude,
    account_id,
    typeReport,
    trafficVolume,
    timestamp,
    congestionLevel,
    img,
    description,
  } = data;

  if (type === 'camera report') {
    const report = new CameraReport({
      camera_id,
      trafficVolume,
      congestionLevel,
      typeReport,
      img,
      timestamp,
    });
    await report.save();

    const notificationMessage = buildNotificationMessage(
      type,
      typeReport,
      description,
      timestamp,
      latitude,
      longitude,
      img
    );
    sendMessageToFrontend(notificationMessage);

    await notifyUsersInRange({
      title: notificationMessage.title,
      message: notificationMessage.content,
      latitude,
      longitude,
      img,
    });
  } else if (type === 'user report') {
    const notificationMessage = buildNotificationMessage(
      type,
      typeReport,
      description,
      timestamp,
      latitude,
      longitude,
      img
    );
    sendMessageToFrontend(notificationMessage);

    await notifyUsersInRange({
      title: notificationMessage.title,
      message: notificationMessage.content,
      latitude,
      longitude,
      img,
    });
  } else if (type === 'create notification') {
    const { type, ...notification } = data;
    notification.typeReport = 'create notification';
    sendMessageToFrontend(notification);
  }
};