import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faTimes } from '@fortawesome/free-solid-svg-icons';

const LocationSuggestions = ({ suggestions, onSelect, onRemove }) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-md">
      {suggestions.map((location, index) => (
        <div
          key={index}
          className="group flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100"
          onClick={() => {
            onSelect(location.place_id, location.description);
          }}
        >
          <FontAwesomeIcon icon={faClock} className="mr-2 text-gray-500" />
          {location.description}
          <FontAwesomeIcon
            icon={faTimes}
            className="text-black-100 cursor-pointer opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(location.place_id);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default LocationSuggestions;
