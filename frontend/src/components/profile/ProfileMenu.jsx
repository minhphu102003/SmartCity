import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PATHS } from "../../constants";

const ProfileMenu = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate(PATHS.LOGIN);
    onClose();
  };

  return (
    <motion.div
      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200"
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
      <Link
        to={PATHS.NOTIFICATIONS}
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
        onClick={onClose}
      >
        Thông báo
      </Link>
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
      >
        Đăng xuất
      </button>
    </motion.div>
  );
};

export default ProfileMenu;
