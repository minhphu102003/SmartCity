import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { MENU_ITEMS } from "../../constants";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full ${
        isOpen ? "w-64" : "w-20"
      } bg-gray-800 text-white transition-all duration-300 z-50`}
    >

      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <FaBars className="cursor-pointer" size={24} onClick={toggleSidebar} />
      </div>

      <div className="flex flex-col items-center space-y-2 m-1">
        {MENU_ITEMS.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              setActiveIndex(index);
              navigate(item.path);
            }}
            className={`flex w-full items-center cursor-pointer p-2 rounded-lg transition-all duration-200
              ${isOpen ? "pl-10" : "justify-center"}
              ${
                activeIndex === index
                  ? "bg-gray-400 text-primaryColor"
                  : "hover:bg-gray-400 hover:text-primaryColor"
              }
            `}
          >
            {item.icon}
            {isOpen && <span className="ml-4 text-sm">{item.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
