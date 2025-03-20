import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PATHS } from "../../constants";
import Notifications from "../notifications/Notifications.jsx";

const ProfileMenu = ({ onClose }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("auth");
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <motion.div
        ref={dropdownRef}
        className="absolute right-0 top-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200"
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
          Quản lý tài khoản
        </Link>

        <button
          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          onClick={() => setShowNotifications((prev) => !prev)}
        >
          Thông báo
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
        >
          Đăng xuất
        </button>
      </motion.div>

      {showNotifications && (
        <div ref={notifRef} className="absolute left-[-280px] top-0">
          <Notifications onClose={() => setShowNotifications(false)} />
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;