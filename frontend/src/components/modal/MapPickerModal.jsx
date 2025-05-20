import React, { useState, useCallback } from 'react';
import ReactMapGL, { Marker, NavigationControl, GeolocateControl, Popup } from 'react-map-gl';
import { MAP_BOX_API, MAP_STYLE } from '../../constants';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { useReverseGeocode } from '../../hooks/useReverseGeocode';

const MapPickerModal = ({ initialLocation, onClose, onSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const [viewport, setViewport] = useState({
    latitude: initialLocation.lat,
    longitude: initialLocation.lng,
    zoom: 13,
  });

  const { address, loading } = useReverseGeocode(selectedLocation.lat, selectedLocation.lng);

  const handleMapClick = useCallback((event) => {
    let lng, lat;
    if (Array.isArray(event.lngLat)) {
      [lng, lat] = event.lngLat;
    } else {
      lng = event.lngLat.lng;
      lat = event.lngLat.lat;
    }
    setSelectedLocation({ lat, lng });
    setViewport((v) => ({ ...v, latitude: lat, longitude: lng }));
  }, []);

  const handleConfirm = () => {
    if (selectedLocation) onSelect(selectedLocation);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg overflow-hidden w-full max-w-3xl h-[80vh] flex flex-col"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Pick a Location</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600">
            <FaTimes />
          </button>
        </div>

        <div className="flex-1 relative">
          <ReactMapGL
            {...viewport}
            onMove={(evt) => setViewport(evt.viewState)}
            mapboxAccessToken={MAP_BOX_API}
            mapStyle={MAP_STYLE}
            onClick={handleMapClick}
          >
            <NavigationControl position="top-left" />
            <GeolocateControl position="top-left" />
            {selectedLocation && (
              <>
                <Marker longitude={selectedLocation.lng} latitude={selectedLocation.lat} color="red" />
                <Popup
                  longitude={selectedLocation.lng}
                  latitude={selectedLocation.lat}
                  closeButton={false}
                  closeOnClick={false}
                  anchor="top"
                  offset={[0, +10]}
                >
                  <div className="text-sm max-w-xs">
                    {loading ? 'Loading address...' : address || 'No address found'}
                  </div>
                </Popup>
              </>
            )}
          </ReactMapGL>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm Location
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MapPickerModal;
