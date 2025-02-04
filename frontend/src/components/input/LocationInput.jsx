import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow, faSearch } from '@fortawesome/free-solid-svg-icons';

const LocationInput = ({ value, onChange, placeholder, focus, onFocus, onBlur, isStart }) => {
  const iconColor = isStart ? 'text-blue-600' : 'text-red-600'; // Xác định màu cho icon

  return (
    <div className="mb-4 flex items-center space-x-3 relative">
      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${iconColor} text-white`}>
        <FontAwesomeIcon icon={faLocationArrow} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
      />
      {focus && (
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute right-3 text-blue-500 transition-all duration-300 transform scale-110"
        />
      )}
    </div>
  );
};

export default LocationInput;
