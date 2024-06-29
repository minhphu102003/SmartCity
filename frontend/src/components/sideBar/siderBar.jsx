import React, { useState } from 'react';
import { FaBars, FaBookmark, FaHistory, FaUser } from 'react-icons/fa'; // Sử dụng react-icons để có các icon
import { toast } from 'react-toastify';
import AuthContext from '../../context/authProvider';
import MethodContext from '../../context/methodProvider';


const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`fixed top-0 left-0 h-full ${isOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300`}>
            <div className="flex items-center justify-center h-16 border-b border-gray-700">
                <FaBars className="cursor-pointer" size={24} onClick={toggleSidebar} />
            </div>
            <div className="flex flex-col items-center mt-4 space-y-4">
                <div className="flex w-full justify-center">
                    <FaBookmark className="cursor-pointer" size={24} />
                    {isOpen && <span className="mt-2 text-sm">Đã lưu</span>}
                </div>
                <div className="flex w-full justify-center">
                    <FaHistory className="cursor-pointer " size={24} />
                    {isOpen && <span className="mt-2 text-sm">Gần đây</span>}
                </div>
                <div className="flex w-full justify-center">
                    <FaUser className="cursor-pointer" size={24} />
                    {isOpen && <span className="mt-2 text-sm">Chia sẻ vị trí</span>}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
