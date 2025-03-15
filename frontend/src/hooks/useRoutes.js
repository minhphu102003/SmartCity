import { useState, useEffect, useCallback } from 'react';
import polyline from '@mapbox/polyline';
import { fetchRoutes } from '../services/route';

const useRoutes = (startMarker, endMarker) => {
  const [routes, setRoutes] = useState([]);
  const [geoJsonRoutes, setGeoJsonRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        if (!fetchedRoutes.length) {
          console.warn('Không tìm thấy tuyến đường nào.');
          return;
        }
        setRoutes(fetchedRoutes);

        const geoJsonData = fetchedRoutes
          .filter((route) => route.geometry)
          .map((route) => {
            const decodedCoordinates = polyline.decode(route.geometry);
            if (!decodedCoordinates.length) return null;

            return {
              type: 'Feature',
              properties: { recommended: route.recommended },
              geometry: {
                type: 'LineString',
                coordinates: decodedCoordinates.map((coord) => [
                  coord[1],
                  coord[0],
                ]),
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

  return { routes, geoJsonRoutes, loading, error, resetRoutes };

};

export default useRoutes;
