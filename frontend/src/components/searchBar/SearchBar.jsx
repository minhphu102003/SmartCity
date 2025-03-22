import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faSearch, faClock, faTimes } from '@fortawesome/free-solid-svg-icons';
import { getGoongMapSuggestions, getPlaceCoordinates } from '../../services/location';

const SearchBar = ({ onRouteClick, onSelectLocation, userLocation }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedLocations, setSuggestedLocations] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim() === '') {
        setSuggestedLocations([]);
        return;
      }

      if (userLocation) {
        const suggestions = await getGoongMapSuggestions(
          searchQuery,
          userLocation.latitude,
          userLocation.longitude
        );
        setSuggestedLocations(suggestions);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300); // Debounce để tránh spam API
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, userLocation]);

  // Xử lý khi chọn một gợi ý
  const handleSelectSuggestion = async (placeId, description) => {
    const coordinates = await getPlaceCoordinates(placeId);
    if (coordinates) {
      onSelectLocation(coordinates.lat, coordinates.lng, description);
    }
    setSearchQuery(description);
    setSuggestedLocations([]);
  };

  return (
    <div className="relative flex w-[30%] items-center gap-2 rounded-xl bg-white px-2 py-1 shadow-md">
      <input
        type="text"
        value={searchQuery}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay để chọn gợi ý không bị mất
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a place..."
        className="flex-1 px-4 py-2 outline-none"
      />

      <button className="flex h-[5vh] w-[40px] items-center justify-center rounded-lg px-2 text-black hover:text-blue-600">
        <FontAwesomeIcon icon={faSearch} />
      </button>

      <button
        className="flex h-[5vh] w-[40px] items-center justify-center rounded-lg px-2 text-black hover:text-green-600"
        onClick={onRouteClick}
      >
        <FontAwesomeIcon icon={faRoute} className="text-lg text-blue-500" />
      </button>

      {isFocused && suggestedLocations.length > 0 && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-md">
          {suggestedLocations.map((location, index) => (
            <div
              key={index}
              className="group flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100"
              onClick={() => handleSelectSuggestion(location.place_id, location.description)}
            >
              <FontAwesomeIcon icon={faClock} className="mr-2 text-gray-500" />
              {location.description}
              <FontAwesomeIcon
                icon={faTimes}
                className="text-black-100 cursor-pointer opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setSuggestedLocations((prev) => prev.filter((item) => item.place_id !== location.place_id));
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
