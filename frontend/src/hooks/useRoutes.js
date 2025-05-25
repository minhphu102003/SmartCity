import { useState, useEffect, useCallback } from 'react';
import polyline from '@mapbox/polyline';
import { fetchRoutes } from '../services/route';

const useRoutes = (startMarker, endMarker) => {
  const [routes, setRoutes] = useState([]);
  const [geoJsonRoutes, setGeoJsonRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [congestionPoints, setCongestionPoints] = useState([]);

  useEffect(() => {
    if (!startMarker || !endMarker) return;

    const fetchRouteData = async () => {
      setLoading(true);
      setError(null);
      try {
        const start = `${startMarker.longitude},${startMarker.latitude}`;
        const end = `${endMarker.longitude},${endMarker.latitude}`;
        const response = await fetchRoutes(start, end);
        const fetchedRoutes = response?.data?.routes || [];
        const reports = response?.data?.reports || [];
        const congestionData = reports.map((r) => [r.longitude, r.latitude]);
        setCongestionPoints(congestionData);
        const newRoutes = response?.data?.newRoutes1 || [];
        if (!fetchedRoutes.length) {
          console.warn('Không tìm thấy tuyến đường nào.');
          return;
        }

        let combinedRoutes = [];

        if (reports.length > 0) {
          combinedRoutes = [
            ...newRoutes.map((r) => ({ ...r, recommended: true })),
            ...fetchedRoutes.map((r) => ({ ...r, recommended: false })),
          ];
        } else {
          combinedRoutes = [
            ...fetchedRoutes.map((r) => ({ ...r, recommended: true })),
          ];
        }
        setRoutes(combinedRoutes);

        const geoJsonData = combinedRoutes
          .filter((route) => route.geometry)
          .map((route) => {
            const decodedCoordinates = polyline.decode(route.geometry);
            if (!decodedCoordinates.length) return null;

            return {
              type: 'Feature',
              properties: {
                recommended: route.recommended,
              },
              geometry: {
                type: 'LineString',
                coordinates: decodedCoordinates.map(([lat, lng]) => [lng, lat]),
              },
            };
          })
          .filter(Boolean);

        setGeoJsonRoutes(geoJsonData);
      } catch (err) {
        setError('Lỗi khi gọi API tìm đường');
        console.error('Lỗi khi gọi API tìm đường:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRouteData();
  }, [startMarker, endMarker]);

  const resetRoutes = useCallback(() => {
    setRoutes([]);
    setGeoJsonRoutes([]);
    setError(null);
  }, []);

  return {
    routes,
    geoJsonRoutes,
    loading,
    error,
    congestionPoints,
    resetRoutes,
  };
};

export default useRoutes;
