import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TransportModeSelector } from '../transportMode';
import { LocationInput } from '../inputs';
import { SearchHistory } from '../history';
import {
  faTimes,
  faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TRANSPORT_MODE_TYPES } from '../../constants';
import {
  getGoongMapSuggestions,
  getPlaceCoordinates,
} from '../../services/location';
import LocationSuggestions from '../searchBar/LocationSuggestions';
import { DEFAULT_SEARCH_HISTORY } from '../../constants';
import useFetchAddress from '../../hooks/useFetchAddress';

const FindRoutes = ({
  onClose,
  onSelectLocation,
  onSelectLocationUser,
  userLocation,
  onInputFocus,
  startMarker,
  endMarker,
}) => {
  const [selectedMode, setSelectedMode] = useState(
    TRANSPORT_MODE_TYPES.DIRECTION
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedLocations, setSuggestedLocations] = useState([]);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [focusStart, setFocusStart] = useState(false);
  const [focusEnd, setFocusEnd] = useState(false);
  const [searchHistory, setSearchHistory] = useState(DEFAULT_SEARCH_HISTORY);

  const handleSearchText = (text) => {
    setSearchQuery(text);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) {
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


  const { address: startAddress, loading: startLoading, error: startError } =
  useFetchAddress(startMarker?.latitude, startMarker?.longitude);

const { address: endAddress, loading: endLoading, error: endError } =
  useFetchAddress(endMarker?.latitude, endMarker?.longitude);

  useEffect(() => {
    if (startLoading) {
      setStartLocation("Đang tìm địa chỉ...");
    } else if (startAddress) {
      setStartLocation(startAddress);
    } else if (startMarker) {
      setStartLocation(`${startMarker.latitude}, ${startMarker.longitude}`);
    }
  }, [startLoading, startAddress, startMarker]);
  
  useEffect(() => {
    if (endLoading) {
      setEndLocation("Đang tìm địa chỉ...");
    } else if (endAddress) {
      setEndLocation(endAddress);
    } else if (endMarker) {
      setEndLocation(`${endMarker.latitude}, ${endMarker.longitude}`);
    }
  }, [endLoading, endAddress, endMarker]);

  const handleSelectSuggestion = async (placeId, description) => {
    console.log("handleSelectSuggestion called with:", placeId, description);
    const coordinates = await getPlaceCoordinates(placeId);
    if (coordinates) {
      const { lat, lng } = coordinates;
      if (focusedInput === 'start') {
        setStartLocation(description);
      } else if (focusedInput === 'end') {
        setEndLocation(description);
      }
      onSelectLocation(lat, lng, description);
    }
    setSearchQuery('');
    setSuggestedLocations([]);
  };

  const handleSelectCurrentLocation = () => {
    onSelectLocationUser();
    if (userLocation) {
      const locationString = `${userLocation.latitude}, ${userLocation.longitude}`;
      if (focusedInput === 'start') {
        setStartLocation(locationString);
      } else if (focusedInput === 'end') {
        setEndLocation(locationString);
      }
    }
  };

  return (
    <motion.div
      initial={{ x: '-100%', opacity: 0 }}
      animate={{ x: '0%', opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="absolute left-0 top-0 z-40 h-full w-[30%] bg-white p-4 shadow-lg"
    >
      <div className="flex items-center border-b pb-5">
        <TransportModeSelector
          selectedMode={selectedMode}
          onSelectMode={setSelectedMode}
        />

        <button
          onClick={onClose}
          className="ml-auto rounded-full p-2 text-black transition-all duration-300 hover:bg-gray-300 hover:bg-opacity-50"
        >
          <FontAwesomeIcon icon={faTimes} className="text-xl" />
        </button>
      </div>

      <div className="align-center mt-5 flex items-center justify-between">
        <div className="mr-2 w-[90%]">
          <div className="relative">
            <LocationInput
              value={startLocation}
              onChange={setStartLocation}
              onSearch={handleSearchText}
              placeholder="Điểm bắt đầu"
              focus={focusStart}
              onFocus={() => {
                setFocusStart(true);
                setFocusedInput('start');
                onInputFocus('start');
              }}
              onBlur={() => {
                setTimeout(() => setFocusStart(false), 200);
              }}
              isStart={true}
            />
            {focusStart && (
              <LocationSuggestions
                suggestions={suggestedLocations}
                onSelect={(placeId, description) => {
                  console.log("handleSelectSuggestion called with:", placeId, description);
                  handleSelectSuggestion(placeId, description);
                  setFocusStart(false);
                }}
                onRemove={() => {}}
              />
            )}
          </div>

          <div className="relative">
            <LocationInput
              value={endLocation}
              onChange={setEndLocation}
              onSearch={handleSearchText}
              placeholder="Điểm kết thúc"
              focus={focusEnd}
              onFocus={() => {
                setFocusEnd(true);
                setFocusedInput('end');
                onInputFocus('end');
              }}
              onBlur={() => {
                setTimeout(() => setFocusEnd(false), 200);
              }}
              isStart={false}
            />
            {focusEnd && (
              <LocationSuggestions
                suggestions={suggestedLocations}
                onSelect={(placeId, description) => {
                  handleSelectSuggestion(placeId, description);
                  setFocusEnd(false);
                }}
                onRemove={() => {}}
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
              onClick={() => {
                setStartLocation(endLocation);
                setEndLocation(startLocation);
              }}
            className="flex items-center justify-center rounded-md p-2 text-black hover:bg-blue-100"
          >
            <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
          </button>
        </div>
      </div>

      <div className="mt-4 border-t border-black pt-4">
        <SearchHistory
          searchHistory={searchHistory}
          onClearHistory={(id) => setSearchHistory(searchHistory.filter((history) => history.id !== id))}
          onSelectLocation={handleSelectCurrentLocation}
        />
      </div>
    </motion.div>
  );
};

export default FindRoutes;
