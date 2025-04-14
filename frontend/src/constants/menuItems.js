import { FaBookmark, FaHistory, FaUser, FaCamera, FaHome, FaBell, FaExclamationTriangle } from "react-icons/fa";
import { PATHS } from "./paths";

export const MENU_ITEMS = [
  { icon: <FaHome size={24} />, label: "Home", path: PATHS.HOME },
  { icon: <FaBookmark size={24} />, label: "Saved", path: PATHS.SAVED },
  { icon: <FaHistory size={24} />, label: "Recent", path: PATHS.RECENT },
  { icon: <FaUser size={24} />, label: "Share Location", path: PATHS.SHARE_LOCATION },
  { icon: <FaCamera size={24} />, label: "Camera", path: PATHS.CAMERA },
  { icon: <FaBell size={24} />, label: "Notifications", path: PATHS.NOTIFICATIONS },
  { icon: <FaExclamationTriangle size={24} />, label: "Report", path: PATHS.REPORT },
];