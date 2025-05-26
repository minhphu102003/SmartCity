import { useEffect, useState } from 'react';
import { getNearestPlaces } from '../services/place';
import { fetchAddress } from '../services/openCageService';

const usePlaces = (page = 1, radius = 500, limit = 10) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [location, setLocation] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchPlaces = async () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser.');
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          try {
            setLoading(true);
            const response = await getNearestPlaces(latitude, longitude, radius, null, limit, page);
            const data = response?.data?.data || [];
            setTotal(response?.data?.total);
            setPlaces(data);
            if (response?.data?.totalPages) {
              setTotalPages(response.data.totalPages);
            }
          } catch (err) {
            console.error('Failed to fetch places:', err);
            setError('Failed to fetch places.');
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError('Permission denied or unable to get location.');
          setLoading(false);
        }
      );
    };

    fetchPlaces();
  }, [page, limit, radius]);

  useEffect(() => {
    const enrichPlacesWithAddress = async () => {
      const updated = await Promise.all(
        places.map(async (place) => {
          if (!place.address && place.latitude && place.longitude) {
            const address = await fetchAddress(place.latitude, place.longitude);
            return { ...place, address };
          }
          return place;
        })
      );
      setPlaces(updated);
    };

    if (!loading && places.length > 0) {
      enrichPlacesWithAddress();
    }
  }, [loading, places]);

  return {
    places,
    total,
    setPlaces,
    loading,
    error,
    totalPages,
    location,
  };
};

export default usePlaces;
