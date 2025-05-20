import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMapGL, { NavigationControl, Popup } from 'react-map-gl';
import { MAP_BOX_API } from '../../constants';
import { CameraMarker } from '../marker';
import 'mapbox-gl/dist/mapbox-gl.css';

const CameraMapModal = ({ camera, onClose, isVisible }) => {
  const [viewport, setViewport] = useState({
    latitude: camera?.latitude || 10.762622,
    longitude: camera?.longitude || 106.660172,
    zoom: 14,
    bearing: 0,
    pitch: 0,
  });

  const [selectedCamera, setSelectedCamera] = useState(camera);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="camera-modal"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="camera-modal-inner"
            className="relative w-[90vw] h-[80vh] bg-white rounded-lg shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 z-10 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>

            <ReactMapGL
              {...viewport}
              width="100%"
              height="100%"
              mapboxAccessToken={MAP_BOX_API}
              onMove={(evt) => setViewport(evt.viewState)}
              mapStyle="mapbox://styles/mapbox/streets-v11"
            >
              <NavigationControl position="top-left" />
              <CameraMarker
                key={camera._id}
                camera={camera}
                zoom={viewport.zoom}
                onSelect={setSelectedCamera}
              />

              {selectedCamera && selectedCamera.link && (
                <Popup
                  longitude={selectedCamera.longitude}
                  latitude={selectedCamera.latitude}
                  closeOnClick={false}
                  onClose={() => setSelectedCamera(null)}
                  offset={[0, -20]}
                >
                  <div className="w-[300px] h-[200px] relative">
                    <button
                      onClick={() => setSelectedCamera(null)}
                      className="absolute top-1 right-1 text-gray-600 hover:text-red-500 font-bold z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                      aria-label="Close popup"
                    >
                      ×
                    </button>
                    <iframe
                      src={`${selectedCamera.link.replace('watch?v=', 'embed/')}`}
                      title="Camera Video"
                      allow="autoplay"
                      allowFullScreen
                      className="w-full h-full rounded-md"
                    />
                  </div>
                </Popup>
              )}
            </ReactMapGL>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CameraMapModal;
