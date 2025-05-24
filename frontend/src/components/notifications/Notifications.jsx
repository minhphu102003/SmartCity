import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, XCircle } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { updateNotification } from '../../services/notification';

dayjs.extend(relativeTime);

const Notifications = ({ onClose, onSelectLocation, notificationList = [], setNotificationList, setNotificationCount }) => {
  const popupRef = useRef(null);
  const [readNotifications, setReadNotifications] = useState({});

  const sortedNotifications = [...notificationList].sort((a, b) => b.timestamp - a.timestamp);
  const handleReadNotification = async (timestamp, id, title) => {
    try {
      await updateNotification(id, { title: title ?? 'Traffic Jam notification', status: "READ" });

      setReadNotifications((prev) => ({ ...prev, [timestamp]: true }));

      setNotificationList((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.timestamp === timestamp
            ? { ...notif, status: "READ" }
            : notif
        )
      );
      setNotificationCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={popupRef}
      className="w-[400px] bg-white shadow-lg rounded-lg p-4 z-50 border border-gray-300 absolute right-5 top-20"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between border-b pb-2 mb-2">
        <h3 className="text-lg font-semibold text-gray-800">Notification</h3>
        <button className="text-gray-500 hover:text-red-500" onClick={onClose}>
          ✖
        </button>
      </div>

      <ul className="space-y-2 max-h-72 overflow-y-auto">
        {sortedNotifications.length === 0 ? (
          <li className="text-center text-gray-500 py-4">No notifications available</li>
        ) : (
          sortedNotifications.map((notif) => (
            <li
              key={notif.timestamp.toString()}
              className={`flex items-center p-3 rounded-lg cursor-pointer border ${readNotifications[notif.timestamp.toString()] || notif.status !== "PENDING"
                  ? "bg-gray-100 border-gray-200"
                  : "bg-blue-50 border-blue-300"
                } hover:bg-gray-200 transition-all`}
              onClick={async () => {
                if (notif?._id) {
                  await handleReadNotification(notif.timestamp.toString(), notif?._id, notif?.title);
                }
                if (typeof onSelectLocation === "function") {
                  onSelectLocation(
                    notif.latitude,
                    notif.longitude,
                    notif?.content || notif?.message
                  );
                }
              }}
            >
              <div className="mr-3">
                {readNotifications[notif.timestamp.toString()] || notif.status !== "PENDING" ? (
                  <XCircle className="w-6 h-6 text-red-500" />
                ) : (
                  <Bell className="w-6 h-6 text-blue-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{notif.title || 'Traffic Jam notification'}</p>
                <p className="text-xs text-gray-500">{notif?.content || notif?.message}</p>
                <p className="text-xs text-gray-400">{dayjs(notif.timestamp).fromNow()}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </motion.div>
  );
};

export default Notifications;
