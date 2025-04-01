import { useState } from "react";
import { Link } from "react-router-dom";
import { FiHome, FiUsers, FiClipboard, FiFileText, FiMenu } from "react-icons/fi";

const SidebarItem = ({ title, to, icon, selected, setSelected, collapsed }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 ${
      selected === title ? "bg-blue-500 text-white" : "text-gray-300 hover:bg-gray-700"
    }`}
    onClick={() => setSelected(title)}
  >
    {icon}
    {!collapsed && <span className="text-sm">{title}</span>}
  </Link>
);

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
            src="../../assets/user.png"
          />
          <h2 className="text-lg font-semibold">Ed Roh</h2>
          <p className="text-sm text-green-400">VP Fancy Admin</p>
        </div>
      )}

      <nav className="px-2 space-y-2">
        <SidebarItem
          title="Dashboard"
          to="/"
          icon={<FiHome className="w-5 h-5" />}
          selected={selected}
          setSelected={setSelected}
          collapsed={isCollapsed}
        />
        {!isCollapsed && (
          <p className="text-gray-500 px-4 mt-4 uppercase text-sm">Data</p>
        )}
        <SidebarItem
          title="Manage Team"
          to="/team"
          icon={<FiUsers className="w-5 h-5" />}
          selected={selected}
          setSelected={setSelected}
          collapsed={isCollapsed}
        />
        <SidebarItem
          title="Contacts"
          to="/contacts"
          icon={<FiClipboard className="w-5 h-5" />}
          selected={selected}
          setSelected={setSelected}
          collapsed={isCollapsed}
        />
        <SidebarItem
          title="Invoices"
          to="/invoices"
          icon={<FiFileText className="w-5 h-5" />}
          selected={selected}
          setSelected={setSelected}
          collapsed={isCollapsed}
        />
      </nav>
    </div>
  );
};

export default SidebarComponent;
