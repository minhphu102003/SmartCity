import { useEffect, useState } from 'react';
import { getPlace } from '../utils/placeUtils';
import { DEFAULT_VIEWPORT } from '../constants';
import { getUserLocation } from '../utils/mapUtils';

export const useMapViewport = () => {
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);
  const [userLocation, setUserLocation] = useState(null);
  const [zoom, setZoom] = useState(DEFAULT_VIEWPORT.zoom);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    getUserLocation(setUserLocation, setViewport);
  }, []);

  const handleViewportChange = (evt) => {
    setViewport(evt.viewState);
    setZoom(evt.viewState.zoom);
  };

  const handleGeolocate = async (event) => {
    const { latitude, longitude } = event.coords;
    setViewport({ latitude, longitude, zoom: 16 });
    setUserLocation({ latitude, longitude });
    setPlaces(await getPlace(latitude, longitude));
  };

  return {
    viewport,
    setViewport,
    zoom,
    userLocation,
    setUserLocation,
    handleViewportChange,
    handleGeolocate,
    places,
    setPlaces,
  };
};