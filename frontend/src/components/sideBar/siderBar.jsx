import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { MENU_ITEMS } from '../../constants';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWebSocket } from '../../websocket/hooks';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { messages } = useWebSocket();

  const authData = JSON.parse(localStorage.getItem('auth') || '{}');
  const token = authData?.token;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full ${isOpen ? 'w-64' : 'w-20'
        } z-50 bg-gray-800 text-white transition-all duration-300`}
    >
      <div className="flex h-16 items-center justify-center border-b border-gray-700">
        <FaBars className="cursor-pointer" size={24} onClick={toggleSidebar} />
      </div>

      <div className="m-1 flex flex-col items-center space-y-2">
        {MENU_ITEMS.filter(
          (item) => item.label !== 'Notifications' || !token
        ).map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className={`flex w-full cursor-pointer items-center rounded-lg p-2 transition-all duration-200 ${isOpen ? 'pl-10' : 'justify-center'
              } ${location.pathname === item.path 
                ? 'bg-gray-400 text-primaryColor'
                : 'hover:bg-gray-400 hover:text-primaryColor'
              }`}
          >
            <div className="relative">
              {item.icon}
              {item.label === 'Notifications' &&
                token &&
                messages.length > 0 && (
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