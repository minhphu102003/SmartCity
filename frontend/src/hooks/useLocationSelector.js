export const useLocationSelector = (
  setStartMarker,
  setEndMarker,
  setUserLocation,
  mapRef,
  setViewport,
  focusedInput
) => {
  const handleSelectLocation = (lat, lng, description) => {
    const newLocation = { latitude: lat, longitude: lng, description };

    if (focusedInput === 'start') {
      setStartMarker(newLocation);
    } else if (focusedInput === 'end') {
      setEndMarker(newLocation);
    } else {
      setUserLocation(newLocation);
    }

    if (mapRef.current && lat && lng) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 16,
        speed: 1.2,
        curve: 1.5,
        essential: true,
      });
    }

    setViewport({ latitude: lat, longitude: lng, zoom: 16 });
  };

  return { handleSelectLocation };
};
