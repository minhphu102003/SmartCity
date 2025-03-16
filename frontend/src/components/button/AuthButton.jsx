import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PATHS } from '../../constants';

const AuthButton = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      setUser(parsedAuth);
    }
  }, []);

  return (
    <motion.div
      className="absolute right-1 top-1 z-20 flex items-center gap-4"
      initial={{ opacity: 0, y: -2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {user ? (
        <Link
          to={PATHS.PROFILE}
          className="flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 shadow-md transition duration-300 hover:bg-gray-700"
        >
          <img
            src={user?.avatar || 'https://via.placeholder.com/40'}
            alt="User Avatar"
            className="h-10 w-10 rounded-full border border-gray-300"
          />
          <span className="hidden text-white sm:block">
            {user?.name || 'username'}
          </span>
        </Link>
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
