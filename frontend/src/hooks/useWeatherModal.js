import { useEffect, useRef, useState } from 'react';
import { getSugget } from '../services/weather';

export const useWeatherModal = (userLocation) => {
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasShownWeatherModal = useRef(false);

  useEffect(() => {
    const fetchWeatherSuggest = async () => {
      const { latitude, longitude } = userLocation || {};

      if (latitude && longitude) {
        setLoading(true);
        try {
          const response = await getSugget(latitude, longitude);
          setWeatherData(response);

          // Open modal only once when data is received
          if (!hasShownWeatherModal.current) {
            setIsWeatherModalOpen(true);
            hasShownWeatherModal.current = true;
          }
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWeatherSuggest();
  }, [userLocation]);

  return {
    isWeatherModalOpen,
    setIsWeatherModalOpen,
    weatherData,
    loading,
    error,
  };
};