import { useState, useEffect } from 'react';
import { getSugget } from '../services/weather';

const useWeatherSuggest = (latitude, longitude) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchWeatherSuggest = async () => {
        if (longitude !== null && latitude !== null) {
          setLoading(true);
          try {
            const response = await getSugget(latitude, longitude);
            setData(response);
          } catch (err) {
            setError(err);
          } finally {
            setLoading(false);
          }
        }
      };
      fetchWeatherSuggest();
    }, [latitude, longitude]);
    return { data, loading, error };
  };
  
  export default useWeatherSuggest;