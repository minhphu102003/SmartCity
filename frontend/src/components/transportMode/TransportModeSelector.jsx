import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faCar, faTrain, faWalking, faBicycle, faPlane } from '@fortawesome/free-solid-svg-icons';

const transportModes = [
  { id: 'direction', icon: faRoute, label: 'Tìm đường' },
  { id: 'car', icon: faCar, label: 'Ô tô' },
  { id: 'train', icon: faTrain, label: 'Tàu hỏa' },
  { id: 'walk', icon: faWalking, label: 'Đi bộ' },
  { id: 'bicycle', icon: faBicycle, label: 'Xe đạp' },
  { id: 'plane', icon: faPlane, label: 'Máy bay' },
];

const TransportModeSelector = ({ selectedMode, onSelectMode }) => (
  <div className="flex gap-2">
    {transportModes.map((mode) => (
      <div key={mode.id} className="group relative flex flex-col items-center">
        <button
          className="relative rounded-full p-2 transition-all duration-300 group-hover:bg-blue-100"
          onClick={() => onSelectMode(mode.id)}
        >
          <span className="absolute inset-0 rounded-full bg-blue-100 opacity-0 transition-all duration-300 group-hover:opacity-100"></span>
          <FontAwesomeIcon
            icon={mode.icon}
            className={`relative z-10 text-lg ${selectedMode === mode.id ? 'text-blue-600' : 'text-black'}`}
          />
        </button>
        <span className="absolute top-[105%] min-h-[20px] whitespace-nowrap rounded bg-white px-2 py-1 text-xs text-black opacity-0 shadow transition-opacity duration-300 group-hover:opacity-100">
          {mode.label}
        </span>
      </div>
    ))}
  </div>
);

export default TransportModeSelector;
