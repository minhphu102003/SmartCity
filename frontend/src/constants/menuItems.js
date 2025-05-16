import { FaCamera, FaHome, FaBell, FaExclamationTriangle } from "react-icons/fa";
import { PATHS } from "./paths";

export const MENU_ITEMS = [
  { icon: <FaHome size={24} />, label: "Home", path: PATHS.HOME },
  { icon: <FaCamera size={24} />, label: "Camera", path: PATHS.CAMERA },
  { icon: <FaBell size={24} />, label: "Notifications", path: PATHS.NOTIFICATIONS },
  { icon: <FaExclamationTriangle size={24} />, label: "Report", path: PATHS.REPORT },
];