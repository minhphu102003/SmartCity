import Notification from '../models/notification.js';
import User from '../models/user.js';
import { NotificationStatus } from '../../shared/constants/notification.js';
import { calculateDistance } from '../../v1/services/distance.js';

export const notifyUsersInRange = async ({
  title,
  message,
  latitude,
  longitude,
  img,
  maxDistance = 10,
}) => {

  const allUsers = await User.find({
    latitude: { $exists: true },
    longitude: { $exists: true },
  });

  const usersInRange = allUsers.filter(
    (user) => calculateDistance(latitude, longitude, user.latitude, user.longitude) <= maxDistance
  );

  for (const user of usersInRange) {
    if (user.account_id) {
      const notification = new Notification({
        title,
        account_id: user.account_id,
        message,
        longitude,
        latitude,
        img,
        status: NotificationStatus.PENDING,
      });
      await notification.save();
    }
  }
};
