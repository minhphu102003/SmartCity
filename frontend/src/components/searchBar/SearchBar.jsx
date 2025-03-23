import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faSearch } from '@fortawesome/free-solid-svg-icons';
import { getGoongMapSuggestions, getPlaceCoordinates } from '../../services/location';
import LocationSuggestions from './LocationSuggestions';

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

    const delayDebounce = setTimeout(fetchSuggestions, 300); 
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, userLocation]);

  const handleSelectSuggestion = async (placeId, description) => {
    const coordinates = await getPlaceCoordinates(placeId);
    if (coordinates) {
      onSelectLocation(coordinates.lat, coordinates.lng, description);
    }
    setSearchQuery(description);
    setSuggestedLocations([]);
  };

  const handleRemoveSuggestion = (placeId) => {
    setSuggestedLocations((prev) => prev.filter((item) => item.place_id !== placeId));
  };

  return (
    <div className="relative flex w-[30%] items-center gap-2 rounded-xl bg-white px-2 py-1 shadow-md">
      <input
        type="text"
        value={searchQuery}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
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

      {isFocused && (
        <LocationSuggestions
          suggestions={suggestedLocations}
          onSelect={handleSelectSuggestion}
          onRemove={handleRemoveSuggestion}
        />
      )}
    </div>
  );
};

export default SearchBar;
