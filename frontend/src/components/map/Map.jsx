import React, { useState, useEffect, useRef } from 'react';
import ReactMapGL, {
  GeolocateControl,
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
import { SearchBar } from '../searchBar';
import { ScrollableButtons } from '../scrollableButtons';
import { FindRoutes } from '../route';
import useRoutes from '../../hooks/useRoutes';
import {
  DEFAULT_VIEWPORT,
  MAP_STYLE,
  PLACE_OPTIONS,
  MAP_BOX_API,
} from '../../constants';
import { getRouteLineStyle, getUserLocation } from '../../utils/mapUtils';
import { MapIcon } from '../icons';
import { AuthButton } from '../button';
import { getPlace } from '../../utils/placeUtils';
import { PlacesMarkers } from '../marker';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WeatherModal from '../modals/WeatherModal';
import useWeatherSuggest from '../../hooks/userWeather';

const Map = () => {
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);
  const [userLocation, setUserLocation] = useState(null);
  const [isRouteVisible, setIsRouteVisible] = useState(false);
  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [places, setPlaces] = useState([]);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const mapRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => await getUserLocation(setUserLocation, setViewport))();
  }, []);

  const {
    data: weatherData,
    loading,
    error,
  } = useWeatherSuggest(userLocation?.latitude, userLocation?.longitude);

  const { routes, geoJsonRoutes, resetRoutes } = useRoutes(
    startMarker,
    endMarker
  );

  useEffect(() => {
    if (weatherData) setIsWeatherModalOpen(true);
  }, [weatherData]);

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast(location.state.toastMessage, {
        type: location.state.statusMessage === 'success' ? 'success' : 'error',
      });

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSelectLocation = (lat, lng, description) => {
    const newLocation = { latitude: lat, longitude: lng, description };
  
    if (focusedInput === 'start') {
      setStartMarker(newLocation);
    } else if (focusedInput === 'end') {
      setEndMarker(newLocation);
    } else {
      setUserLocation(newLocation);
    }
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 16,
        speed: 1.2,  
        curve: 1.5, 
        essential: true
      });
    }
    setViewport({ latitude: lat, longitude: lng, zoom: 16 });
  };

  const handleGeolocate = async (event) => {
    const { latitude, longitude } = event.coords;
    setViewport({ latitude, longitude, zoom: 16 });
    setUserLocation({ latitude, longitude });
    setPlaces(await getPlace(latitude, longitude));
  };

  return (
    <div className="relative h-screen w-full">
      {isWeatherModalOpen && weatherData && (
        <WeatherModal
          onClose={() => setIsWeatherModalOpen(false)}
          weather={weatherData}
        />
      )}

      <AnimatePresence>
        {!isRouteVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute left-[2%] top-4 z-20 flex w-[95%] items-center gap-2"
          >
          <SearchBar
            onRouteClick={() => setIsRouteVisible(true)}
            onSelectLocation={handleSelectLocation}
            userLocation={userLocation}            
          />
            <ScrollableButtons
              data={PLACE_OPTIONS}
              setPlaces={setPlaces}
              longitude={userLocation?.longitude}
              latitude={userLocation?.latitude}
            />
            <AuthButton />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isRouteVisible && (
          <FindRoutes
            onClose={() => {
              setIsRouteVisible(false);
              setStartMarker(null);
              setEndMarker(null);
              setUserLocation(null);
              resetRoutes();
            }}
            onSelectLocation={() =>
              getUserLocation(setUserLocation, setViewport)
            }
            userLocation={userLocation}
            onInputFocus={setFocusedInput}
            startMarker={startMarker}
            endMarker={endMarker}
            routes={routes}
          />
        )}
      </AnimatePresence>

      <ReactMapGL
        {...viewport}
        ref={mapRef} 
        width="100%"
        height="100%"
        mapStyle={MAP_STYLE}
        mapboxAccessToken={MAP_BOX_API}
        transitionDuration={200}
        onMove={(evt) => setViewport(evt.viewState)}
        onClick={(event) => {
          const { lng, lat } = event.lngLat;
          if (focusedInput === "start") {
            setStartMarker({ longitude: lng, latitude: lat });
          } else if (focusedInput === "end") {
            setEndMarker({ longitude: lng, latitude: lat });
          }
        }}
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

        <PlacesMarkers places={places} />

        <NavigationControl position="bottom-right" />
        <GeolocateControl
          position="bottom-right"
          trackUserLocation={true}
          onGeolocate={handleGeolocate}
        />
      </ReactMapGL>
    </div>
  );
};

export default Map;
