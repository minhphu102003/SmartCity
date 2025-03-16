import { FaBookmark, FaHistory, FaUser } from "react-icons/fa";
import { PATHS } from "./paths";

export const MENU_ITEMS = [
  { icon: <FaBookmark size={24} />, label: "Đã lưu", path: PATHS.SAVED },
  { icon: <FaHistory size={24} />, label: "Gần đây", path: PATHS.RECENT },
  { icon: <FaUser size={24} />, label: "Chia sẻ vị trí", path: PATHS.SHARE_LOCATION },
];