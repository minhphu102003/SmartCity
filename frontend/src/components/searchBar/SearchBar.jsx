import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faSearch, faClock, faTimes } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ onRouteClick }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedLocations, setSuggestedLocations] = useState([
    'Hồ Gươm',
    'Phố Cổ Hà Nội',
    'Sân bay Nội Bài',
    'Lăng Bác',
    'Chợ Đồng Xuân',
  ]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRemoveItem = (location) => {
    setSuggestedLocations((prevLocations) =>
      prevLocations.filter((item) => item !== location)
    );
  };

  return (
    <div className="relative flex w-[30%] items-center gap-2 rounded-xl bg-white px-2 py-1 shadow-md">
      <input
        type="text"
        value={searchQuery}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleSearchChange}
        placeholder="Tìm kiếm địa điểm..."
        className="flex-1 px-4 py-2 outline-none"
      />
      {/* Nút tìm kiếm */}
      <button className="flex h-[5vh] w-[40px] items-center justify-center rounded-lg px-2 text-black hover:text-blue-600">
        <FontAwesomeIcon icon={faSearch} />
      </button>
      <button
        className="flex h-[5vh] w-[40px] items-center justify-center rounded-lg px-2 text-black hover:text-green-600"
        onClick={onRouteClick}
      >
        <FontAwesomeIcon icon={faRoute} className="text-blue-500 text-lg" />
      </button>

      {(isFocused || searchQuery) && (
        <div className="absolute top-full left-0 w-full max-h-60 z-50 overflow-y-auto bg-white border border-gray-300 shadow-md mt-1 rounded-lg">
          {suggestedLocations
            .filter((location) => location.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((location, index) => (
              <div
                key={index}
                className="group flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <FontAwesomeIcon icon={faClock} className="text-gray-500 mr-2" />
                {location}
                <FontAwesomeIcon
                  icon={faTimes}
                  className="text-black-100 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={() => handleRemoveItem(location)}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
