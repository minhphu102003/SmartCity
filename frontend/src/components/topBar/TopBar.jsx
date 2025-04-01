import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchIcon from '@mui/icons-material/Search';

const Topbar = () => {
  return (
    <div className="flex items-center justify-between bg-white p-4 shadow-md">
      <div className="flex items-center rounded-lg bg-gray-100 p-2">
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent px-2 outline-none"
        />
        <button className="p-2">
          <SearchIcon />
        </button>
      </div>
      <div className="flex gap-4">
        <button className="p-2">
          <NotificationsOutlinedIcon />
        </button>
        <button className="p-2">
          <SettingsOutlinedIcon />
        </button>
        <button className="p-2">
          {' '}
          <PersonOutlinedIcon />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
