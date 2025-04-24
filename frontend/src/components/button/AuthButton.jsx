import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PATHS } from '../../constants';
import ProfileMenu from '../profile/ProfileMenu';
import { getNotifications } from '../../services/notification';

const shakeVariants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.6, ease: 'easeInOut' },
  },
};

const AuthButton = ({ onSelectLocation, shouldShake, latestMessage }) => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationList, setNotificationList] = useState([]);

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      setUser(parsedAuth);

      fetchNotificationCount();
    }
  }, []);

  useEffect(() => {
    if (latestMessage) {
      setNotificationList((prevList) => [latestMessage, ...prevList]);
      setNotificationCount((count) => count + 1);
    }
  }, [latestMessage]);

  const fetchNotificationCount = async () => {
    try {
      const data = await getNotifications({ page: 1, limit: 100 });
      const notifications = data?.data || [];
      const unread = notifications.filter((n) => n.status === 'PENDING');
      setNotificationCount(unread.length);
      setNotificationList(notifications);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <motion.div
      className="absolute right-4 top-2 z-20 flex items-center gap-4"
      initial={{ opacity: 0, y: -2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {user ? (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="relative"
          >
            <motion.img
              src={
                user?.avatar ||
                require('../../assets/images/default_avatar.png')
              }
              alt="User Avatar"
              className="h-10 w-10 cursor-pointer rounded-full border border-gray-300"
              variants={shakeVariants}
              animate={shouldShake ? 'shake' : undefined}
            />
            {notificationCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white shadow">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {menuOpen && (
              <ProfileMenu
                onClose={() => setMenuOpen(false)}
                onSelectLocation={onSelectLocation}
                notificationCount={notificationCount}
                notificationList={notificationList}
                setNotificationList={setNotificationList}
                setNotificationCount={setNotificationCount}
              />
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link to={PATHS.LOGIN}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition duration-300 hover:bg-blue-500"
            >
              Sign In
            </motion.button>
          </Link>
          <Link to={PATHS.REGISTER}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg bg-primary-500 px-4 py-2 text-white shadow-md transition duration-300 hover:bg-primary-600"
            >
              Sign Up
            </motion.button>
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default AuthButton;
