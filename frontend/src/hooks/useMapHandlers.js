import { useState } from 'react';
import { toast } from 'react-toastify';
import { createNotification } from '../services/notification';

export const useMapHandlers = (contextMenu) => {
  const [notificationPopup, setNotificationPopup] = useState(null);

  const handleCreateNotification = (longitude, latitude) => {
    setNotificationPopup({
      x: contextMenu?.x,
      y: contextMenu?.y,
      longitude,
      latitude,
    });
  };

  const handleSubmitNotification = async (data) => {
    try {
      console.log(data)
      const response = await createNotification(data);
      console.log('Notification created:', response);
      toast.success('Notification created successfully!');
    } catch (error) {
      console.error('Error creating notification:', error);
      toast.error('Failed to create notification. Please try again.');
    }
  };

  return {
    setNotificationPopup,
    notificationPopup,
    handleCreateNotification,
    handleSubmitNotification,
  };
};