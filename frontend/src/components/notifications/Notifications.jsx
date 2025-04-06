import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, XCircle } from "lucide-react"; 
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const Notifications = ({ onClose, notifications, onSelectLocation }) => {
  const popupRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [readNotifications, setReadNotifications] = useState({});

  const mockNotifications = [
    {
      id: 1,
      title: "Thông báo mới từ hệ thống",
      content: "Hệ thống sẽ bảo trì lúc 12h đêm nay.",
      status: "UNREAD",
      isRead: false,
      timestamp: Date.now() - 1000 * 60 * 2,
      longitude: "",
      latitude: "",
      img: ""
    },
    {
      id: 2,
      title: "Cảnh báo lũ lụt",
      content: "Khu vực ABC đang có lụt. Vui lòng chú ý",
      status: "UNREAD",
      isRead: false,
      timestamp: Date.now() - 1000 * 60 * 10,
      longitude: "108.22291831147083",
      latitude: "16.07481413426029",
      img: ""
    }
  ];

  const data = Array.isArray(notifications) && notifications.length > 0 ? notifications : mockNotifications;
  const sortedNotifications = [...data].sort((a, b) => b.timestamp - a.timestamp);
  const displayedNotifications = expanded ? sortedNotifications.slice(0, 10) : sortedNotifications.slice(0, 3);

  const handleReadNotification = (id) => {
    setReadNotifications((prev) => ({ ...prev, [id]: true }));
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
      className="w-80 bg-white shadow-lg rounded-lg p-4 z-50 border border-gray-300 absolute right-5 top-20"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between border-b pb-2 mb-2">
        <h3 className="text-lg font-semibold text-gray-800">Thông báo</h3>
        <button className="text-gray-500 hover:text-red-500" onClick={onClose}>
          ✖
        </button>
      </div>

      <ul className="space-y-2 max-h-72 overflow-y-auto">
        {displayedNotifications.map((notif) => (
          <li
            key={notif.id}
            className={`flex items-center p-3 rounded-lg cursor-pointer border ${
              readNotifications[notif.id] || notif.isRead
                ? "bg-gray-100 border-gray-200"
                : "bg-blue-50 border-blue-300"
            } hover:bg-gray-200 transition-all`}
            onClick={() => {
              handleReadNotification(notif.id);
              if (typeof onSelectLocation === 'function') {
                onSelectLocation(
                  notif.latitude || 16.0544,
                  notif.longitude || 108.2022,
                  notif.content
                );
              }
            }}
          >
            <div className="mr-3">
              {readNotifications[notif.id] || notif.isRead ? (
                <XCircle className="w-6 h-6 text-red-500" />
              ) : (
                <Bell className="w-6 h-6 text-blue-500" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{notif.title}</p>
              <p className="text-xs text-gray-500">{notif.content}</p>
              <p className="text-xs text-gray-400">{dayjs(notif.timestamp).fromNow()}</p>
            </div>
          </li>
        ))}
      </ul>

      {sortedNotifications.length > 3 && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-3 w-full text-center text-blue-500 font-semibold hover:underline"
        >
          {expanded ? "Thu gọn" : "Xem tất cả"}
        </button>
      )}
    </motion.div>
  );
};

export default Notifications;
