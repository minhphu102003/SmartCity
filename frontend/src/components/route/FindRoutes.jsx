import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const FindRoutes = ({ onClose }) => {
  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: "0%", opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }} // Tăng duration cho hiệu ứng mượt hơn
      className="absolute left-0 top-0 z-40 h-full w-[30%] bg-white p-4 shadow-lg"
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-red-500 p-2 text-white"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
      {/* Nội dung tìm đường */}
      <h2 className="text-xl font-bold">Tìm đường</h2>
      <p>Chọn điểm đi và điểm đến.</p>
      {/* Thêm các input tìm đường ở đây */}
    </motion.div>
  );
};

export default FindRoutes;
