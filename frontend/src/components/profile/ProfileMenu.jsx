import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PATHS } from '../../constants';
import Notifications from '../notifications/Notifications.jsx';

const ProfileMenu = ({ onClose, onSelectLocation, notificationCount, notificationList, setNotificationList, setNotificationCount }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate(PATHS.LOGIN);
    onClose();
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <motion.div
        ref={dropdownRef}
        className="absolute right-0 top-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <Link
          to={PATHS.PROFILE}
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          onClick={onClose}
        >
          Account Management
        </Link>

        <button
          className="relative block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
          onClick={() => setShowNotifications((prev) => !prev)}
        >
          Notifications
          {notificationCount > 0 && (
            <span className="absolute right-14 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
        >
          Log out
        </button>
      </motion.div>

      {showNotifications && (
        <div ref={notifRef} className="absolute left-[-135px] top-[-15px]">
          <Notifications
            onClose={() => setShowNotifications(false)}
            onSelectLocation={onSelectLocation}
            notificationList={notificationList}
            setNotificationList={setNotificationList}
            setNotificationCount={setNotificationCount}
          />
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
