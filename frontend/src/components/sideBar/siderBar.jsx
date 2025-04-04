import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { MENU_ITEMS } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../../websocket/hooks';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const { messages } = useWebSocket();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full ${
        isOpen ? 'w-64' : 'w-20'
      } z-50 bg-gray-800 text-white transition-all duration-300`}
    >
      <div className="flex h-16 items-center justify-center border-b border-gray-700">
        <FaBars className="cursor-pointer" size={24} onClick={toggleSidebar} />
      </div>

      <div className="m-1 flex flex-col items-center space-y-2">
        {MENU_ITEMS.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              setActiveIndex(index);
              navigate(item.path);
            }}
            className={`flex w-full cursor-pointer items-center rounded-lg p-2 transition-all duration-200 ${isOpen ? 'pl-10' : 'justify-center'} ${
              activeIndex === index
                ? 'bg-gray-400 text-primaryColor'
                : 'hover:bg-gray-400 hover:text-primaryColor'
            } `}
          >
            <div className="relative">
              {item.icon}
              {item.label === 'Notifications' && messages.length > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                  {messages.length}
                </span>
              )}
            </div>
            {isOpen && <span className="ml-4 text-sm">{item.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
