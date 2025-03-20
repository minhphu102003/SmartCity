import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PATHS } from "../../constants";
import ProfileMenu from "../profile/ProfileMenu";

const AuthButton = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);


  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      setUser(parsedAuth);
    }
  }, []);

  // Close when click outside box
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };  
  }, [menuOpen]);

  return (
    <motion.div
      className="absolute right-4 top-4 z-20 flex items-center gap-4"
      initial={{ opacity: 0, y: -2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {user ? (
        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen((prev) => !prev)}>
            <img
              src={user?.avatar || require("../../assets/images/profile_pic.png")}
              alt="User Avatar"
              className="h-10 w-10 rounded-full border border-gray-300 cursor-pointer"
            />
          </button>

          <AnimatePresence>
            {menuOpen && <ProfileMenu onClose={() => setMenuOpen(false)} />}
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
              Đăng Nhập
            </motion.button>
          </Link>
          <Link to={PATHS.REGISTER}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg bg-primary-500 px-4 py-2 text-white shadow-md transition duration-300 hover:bg-primary-600"
            >
              Đăng Ký
            </motion.button>
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default AuthButton;
