import React, { useState } from 'react';
import { Marker } from 'react-map-gl';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faStar,
  faDoorOpen,
  faDoorClosed,
} from '@fortawesome/free-solid-svg-icons';

const PlacesMarkers = ({ places }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <>
      {places.map((place) => (
        <Marker
          key={place.id}
          longitude={place.longitude}
          latitude={place.latitude}
          onClick={() => setSelectedPlace(place)}
        >
          <div className="cursor-pointer">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="text-3xl text-red-500"
            />
          </div>
        </Marker>
      ))}

      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-5 left-[600px] z-50 w-[90%] max-w-md -translate-x-1/2 rounded-lg bg-white pb-6 shadow-lg"
          >
            <div className="flex flex-col items-center">
              <img
                src={selectedPlace.img}
                alt={selectedPlace.name}
                className="h-40 w-full rounded-lg border-2 border-gray-200 object-cover shadow-md"
              />
              <h2 className="mt-4 text-center text-xl font-semibold">
                {selectedPlace.name}
              </h2>
              <p className="flex items-center gap-1 text-lg text-gray-600">
                {Array.from({ length: Math.round(selectedPlace.star) }).map(
                  (_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      className="text-yellow-500"
                    />
                  )
                )}
                <span className="ml-1">({selectedPlace.star})</span>
              </p>
              <p className="text-gray-500">{selectedPlace.type}</p>
              <p className="flex items-center gap-1 text-sm text-gray-400">
                <FontAwesomeIcon
                  icon={selectedPlace.status ? faDoorOpen : faDoorClosed}
                  className={
                    selectedPlace.status ? 'text-green-500' : 'text-red-500'
                  }
                />
                {selectedPlace.status ? 'Open' : 'Closed'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedPlace && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSelectedPlace(null)}
        />
      )}
    </>
  );
};

export default PlacesMarkers;
