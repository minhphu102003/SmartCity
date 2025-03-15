export const getRouteLineStyle = (route, index, geoJsonRoutes) => {
  const firstRecommendedIndex = geoJsonRoutes.findIndex(
    (r) => r.properties.recommended
  );

  if (route.properties.recommended && index === firstRecommendedIndex) {
    return {
      'line-color': '#1f618d',
      'line-width': 6,
      'line-opacity': 1,
    };
  } else if (route.properties.recommended) {
    return {
      'line-color': '#3498db',
      'line-width': 5,
      'line-opacity': 0.8,
    };
  } else {
    return {
      'line-color': '#FF0000',
      'line-width': 5,
      'line-opacity': 0.8,
    };
  }
};

export const getUserLocation = (setUserLocation, setViewport) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setViewport((prev) => ({ ...prev, latitude, longitude, zoom: 16 }));
      },
      (error) => {
        console.error('Lỗi lấy vị trí:', error);
      }
    );
  } else {
    console.error('Trình duyệt không hỗ trợ Geolocation');
  }
};
