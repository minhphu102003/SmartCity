import React, { useState } from 'react';
import ReactMapGL, {
  GeolocateControl,
  FullscreenControl,
  NavigationControl,
  Marker,
  Source,
  Layer,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  faLocationDot,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../searchBar/SearchBar';
import ScrollableButtons from '../scrollableButtons/ScrollableButtons';
import FindRoutes from '../route/FindRoutes';
import useRoutes from '../../hooks/useRoutes';
import { TRANSPORT_OPTIONS } from '../../constants/transportOptions';
import { DEFAULT_VIEWPORT, MAP_STYLE } from '../../constants/mapConfig';
import { getRouteLineStyle, getUserLocation } from '../../utils/mapUtils';
import MapIcon from '../icons/MapIcon';

const Map = () => {
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);
  const [userLocation, setUserLocation] = useState(null);
  const [isRouteVisible, setIsRouteVisible] = useState(false);
  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  const { routes, geoJsonRoutes, loading, error, resetRoutes } = useRoutes(
    startMarker,
    endMarker
  );

  const handleGeolocate = (event) => {
    const { latitude, longitude } = event.coords;
    setViewport({ latitude, longitude, zoom: 16 });
    setUserLocation({ latitude, longitude });
  };

  const handleMapClick = (event) => {
    const { lng, lat } = event.lngLat;
    if (focusedInput === 'start') {
      setStartMarker({ longitude: lng, latitude: lat });
    } else if (focusedInput === 'end') {
      setEndMarker({ longitude: lng, latitude: lat });
    }
  };

  const handleInputFocus = (inputType) => {
    setFocusedInput(inputType);
  };

  const handleRouteClick = () => {
    setIsRouteVisible(true);
  };

  const handleCloseRoute = () => {
    setIsRouteVisible(false);
    setStartMarker(null);
    setEndMarker(null);
    setUserLocation(null);
    resetRoutes();
  };

  return (
    <div className="relative h-screen w-full">
      <AnimatePresence>
        {!isRouteVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute left-[2%] top-4 z-50 flex w-[92%] items-center gap-4"
          >
            <SearchBar onRouteClick={handleRouteClick} />
            <ScrollableButtons data={TRANSPORT_OPTIONS} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isRouteVisible && (
          <FindRoutes
            onClose={handleCloseRoute}
            onSelectLocation={() =>
              getUserLocation(setUserLocation, setViewport)
            }
            userLocation={userLocation}
            onInputFocus={handleInputFocus}
            startMarker={startMarker}
            endMarker={endMarker}
            routes={routes}
          />
        )}
      </AnimatePresence>

      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle={MAP_STYLE}
        mapboxAccessToken={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        transitionDuration={200}
        onMove={(evt) => setViewport(evt.viewState)}
        onClick={handleMapClick}
      >
        {geoJsonRoutes.map((route, index) => (
          <Source key={index} id={`route-${index}`} type="geojson" data={route}>
            <Layer
              id={`route-line-${index}`}
              type="line"
              paint={getRouteLineStyle(route, index, geoJsonRoutes)}
            />
          </Source>
        ))}

        {userLocation && (
          <Marker
            longitude={userLocation.longitude}
            latitude={userLocation.latitude}
          >
            <MapIcon icon={faLocationDot} className="text-3xl text-green-600" />
          </Marker>
        )}
        {startMarker && (
          <Marker
            longitude={startMarker.longitude}
            latitude={startMarker.latitude}
          >
            <MapIcon icon={faMapMarkerAlt} className="text-3xl text-blue-500" />
          </Marker>
        )}

        {endMarker && (
          <Marker longitude={endMarker.longitude} latitude={endMarker.latitude}>
            <MapIcon icon={faMapMarkerAlt} className="text-3xl text-red-500" />
          </Marker>
        )}

        <GeolocateControl
          style={{ top: 10, left: 10 }}
          trackUserLocation={true}
          onGeolocate={handleGeolocate}
        />
        <FullscreenControl />
        <NavigationControl />
      </ReactMapGL>
    </div>
  );
};

export default Map;
