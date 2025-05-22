import { Link } from "react-router-dom";

const SidebarItem = ({ title, to, icon, selected, collapsed }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 ${selected ? "bg-blue-500 text-white" : "text-gray-300 hover:bg-gray-700"
      }`}
  >
    {icon}
    {!collapsed && <span className="text-sm">{title}</span>}
  </Link>
);

export default SidebarItem;