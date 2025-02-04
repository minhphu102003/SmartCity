import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TransportModeSelector from '../transportMode/TransportModeSelector';
import LocationInput from '../input/LocationInput';
import SearchHistory from '../history/SearchHistory';
import {
  faTimes,
  faExchangeAlt,
  faClock,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FindRoutes = ({
  onClose,
  onSelectLocation,
  userLocation,
  onInputFocus,
  startMarker,
  endMarker,
}) => {
  const [selectedMode, setSelectedMode] = useState('direction');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [focusStart, setFocusStart] = useState(false);
  const [focusEnd, setFocusEnd] = useState(false);
  const [searchHistory, setSearchHistory] = useState([
    {
      id: 0,
      content: 'Vị trí hiện tại',
      icon: faMapMarkerAlt,
      isCurrentLocation: true, // Đánh dấu đây là vị trí hiện tại
    },
    { id: 1, content: 'Hà Nội', icon: faClock },
    { id: 2, content: 'TP.HCM', icon: faClock },
    { id: 3, content: 'Đà Nẵng', icon: faClock },
  ]);

  useEffect(() => {
    if (startMarker) {
      setStartLocation(`${startMarker.latitude}, ${startMarker.longitude}`);
    }
  }, [startMarker]);

  useEffect(() => {
    if (endMarker) {
      setEndLocation(`${endMarker.latitude}, ${endMarker.longitude}`);
    }
  }, [endMarker]);

  const handleSwapLocations = () => {
    setStartLocation(endLocation);
    setEndLocation(startLocation);
  };

  const handleClearHistory = (id) => {
    setSearchHistory(searchHistory.filter((history) => history.id !== id));
  };

  const handleSelectCurrentLocation = () => {
    onSelectLocation();
    if (userLocation) {
      const locationString = `${userLocation.latitude}, ${userLocation.longitude}`;
      if (focusedInput === 'start') {
        setStartLocation(locationString);
      } else if (focusedInput === 'end') {
        setEndLocation(locationString);
      }
      console.log('Vị trí hiện tại:', locationString);
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
      {/* Thanh chọn phương tiện */}
      <div className="flex items-center border-b pb-5">
        <TransportModeSelector
          selectedMode={selectedMode}
          onSelectMode={setSelectedMode}
        />

        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="ml-auto rounded-full p-2 text-black transition-all duration-300 hover:bg-gray-300 hover:bg-opacity-50"
        >
          <FontAwesomeIcon icon={faTimes} className="text-xl" />
        </button>
      </div>

      {/* Ô input cho điểm đi và điểm đến */}
      <div className="align-center mt-5 flex items-center justify-between">
        <div className="mr-2 w-[90%]">
          <LocationInput
            value={startLocation}
            onChange={setStartLocation}
            placeholder="Điểm bắt đầu"
            focus={focusStart}
            onFocus={() => {
              setFocusStart(true);
              setFocusedInput('start');
              onInputFocus('start');
            }}
            onBlur={() => setFocusStart(false)}
            isStart={true} // Điểm bắt đầu
          />

          <LocationInput
            value={endLocation}
            onChange={setEndLocation}
            placeholder="Điểm kết thúc"
            focus={focusEnd}
            onFocus={() => {
              setFocusEnd(true);
              setFocusedInput('end');
              onInputFocus('end');
            }}
            onBlur={() => setFocusEnd(false)}
            isStart={false} // Điểm kết thúc
          />
        </div>

        {/* Nút hoán đổi vị trí */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSwapLocations}
            className="flex items-center justify-center rounded-md p-2 text-black hover:bg-blue-100"
          >
            <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
          </button>
        </div>
      </div>

      {/* Phần danh sách lịch sử tìm kiếm (Hiển thị liên tục) */}
      <div className="mt-4 border-t border-black pt-4">
        <SearchHistory
          searchHistory={searchHistory}
          onClearHistory={handleClearHistory}
          onSelectLocation={handleSelectCurrentLocation}
        />
      </div>
    </motion.div>
  );
};

export default FindRoutes;
