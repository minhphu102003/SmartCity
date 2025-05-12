import CameraReport from '../api/v1/models/cameraReport.js';
import AccountReport from '../api/v1/models/accountReport.js';
import { buildNotificationMessage } from '../api/shared/utils/notification.js';
import { notifyUsersInRange } from '../api/shared/utils/notifyUsersInRange.js';
import { NOTIFICATION_FIELDS, NOTIFICATION_TYPES } from './constants.js';

export const handleKafkaMessage = async (data, sendMessageToFrontend) => {
  const {
    type,
    latitude,
    camera_id,
    reportId,
    longitude,
    account_id,
    typeReport,
    trafficVolume,
    timestamp,
    congestionLevel,
    img,
    description,
  } = data;

  if (type === NOTIFICATION_TYPES.CAMERA_REPORT) {
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
      [NOTIFICATION_FIELDS.TITLE]: notificationMessage.title,
      [NOTIFICATION_FIELDS.MESSAGE]: notificationMessage.content,
      latitude,
      longitude,
      img,
    });
  } else if (type === NOTIFICATION_TYPES.USER_REPORT) {

    if (reportId) {
      await AccountReport.findByIdAndUpdate(reportId, {
        analysisStatus: true,
      });
    }

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
      [NOTIFICATION_FIELDS.TITLE]: notificationMessage.title,
      [NOTIFICATION_FIELDS.MESSAGE]: notificationMessage.content,
      latitude,
      longitude,
      img,
    });
    
  } else if (type === NOTIFICATION_TYPES.CREATE_NOTIFICATION) {
    const { type, ...notification } = data;
    notification.typeReport = NOTIFICATION_TYPES.CREATE_NOTIFICATION;
    sendMessageToFrontend(notification);
  }
};