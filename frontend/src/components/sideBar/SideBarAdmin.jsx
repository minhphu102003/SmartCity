import { useState } from "react";
import { FiHome, FiUsers, FiClipboard, FiMapPin, FiBell, FiCamera, FiMenu } from "react-icons/fi";
import { PATHS } from '../../constants/paths';
import SidebarItem from './SidebarItem';

const SidebarComponent = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <div className={`h-screen bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      <button
        className="flex items-center justify-center w-full py-4 hover:bg-gray-800"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <FiMenu className="w-6 h-6" />
      </button>

      {!isCollapsed && (
        <div className="mb-6 text-center">
          <img
            alt="profile-user"
            className="w-14 h-14 rounded-full mx-auto mb-2 border-2 border-gray-500"
            src={
              require('../../assets/images/default_avatar.png')
            }
          />
          <h2 className="text-lg font-semibold">Admin</h2>
          <p className="text-sm text-green-400">admin@gmail.com</p>
        </div>
      )}

      <nav className="px-2 space-y-2">
        <SidebarItem
          title="Dashboard"
          to={PATHS.ADMIN}
          icon={<FiHome className="w-5 h-5" />}
          selected={selected}
          setSelected={setSelected}
          collapsed={isCollapsed}
        />
        {!isCollapsed && (
          <p className="text-gray-500 px-4 mt-4 uppercase text-sm">Manage</p>
        )}
        <SidebarItem
          title="Manage User"
          to={PATHS.MANAGE_USERS}
          icon={<FiUsers className="w-5 h-5" />}
          selected={selected}
          setSelected={setSelected}
          collapsed={isCollapsed}
        />
        <SidebarItem
          title="Manage Report"
          to={PATHS.MANAGE_REPORTS}
          icon={<FiClipboard className="w-5 h-5" />}
          selected={selected}
          setSelected={setSelected}
          collapsed={isCollapsed}
        />
        <SidebarItem
          title="Manage Places"
          to={PATHS.MANAGE_PLACES}
          icon={<FiMapPin className="w-5 h-5" />}
          selected={selected}
          setSelected={setSelected}
          collapsed={isCollapsed}
        />

        <SidebarItem
          title="Manage Camera"
          to={PATHS.CREATE_CAMERA}
          icon={<FiCamera className="w-5 h-5" />}
          selected={selected}
          setSelected={setSelected}
          collapsed={isCollapsed}
        />

        {!isCollapsed && (
          <p className="text-gray-500 px-4 mt-4 uppercase text-sm">Custom Notification</p>
        )}
        <SidebarItem
          title="Custom Map"
          to={PATHS.CREATE_NOTIFICATION}
          icon={<FiBell className="w-5 h-5" />}
          selected={selected}
          setSelected={setSelected}
          collapsed={isCollapsed}
        />
      </nav>
    </div>
  );
};

export default SidebarComponent;
