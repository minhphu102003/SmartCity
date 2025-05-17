import { useEffect, useState } from 'react';
import { fetchAddress } from '../services/openCageService'; 

export const useReverseGeocode = (lat, lng) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAddress = async () => {
      if (typeof lat !== 'number' || typeof lng !== 'number') {
        setAddress('Invalid coordinates');
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await fetchAddress(lat, lng);
      setAddress(result);
      setLoading(false);
    };

    getAddress();
  }, [lat, lng]);

  return { address, loading };
};
