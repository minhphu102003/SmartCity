import React from 'react';
import FindRoutes from './FindRoutes';

const RouteModal = ({
  setIsRouteVisible,
  setStartMarker,
  setEndMarker,
  setUserLocation,
  resetRoutes,
  handleSelectLocation,
  getUserLocation,
  setViewport,
  userLocation,
  setFocusedInput,
  startMarker,
  endMarker,
  routes,
}) => {
  return (
    <FindRoutes
      onClose={() => {
        setIsRouteVisible(false);
        setStartMarker(null);
        setEndMarker(null);
        setUserLocation(null);
        resetRoutes();
      }}
      onSelectLocation={handleSelectLocation}
      onSelectLocationUser={() => getUserLocation(setUserLocation, setViewport)}
      userLocation={userLocation}
      onInputFocus={setFocusedInput}
      startMarker={startMarker}
      endMarker={endMarker}
      routes={routes}
    />
  );
};

export default RouteModal;
