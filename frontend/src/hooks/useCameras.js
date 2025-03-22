import { useState, useEffect } from 'react';
import { getCameras } from '../services/camera';

const useCameras = (queryParams) => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCameras = async () => {
      setLoading(true);
      try {
        const response = await getCameras(queryParams);
        console.log(response?.data);
        setCameras(response?.data || []);
      } catch (err) {
        setError(err?.message);
      }
      setLoading(false);
    };

    loadCameras();
  }, [JSON.stringify(queryParams)]);

  return { cameras, loading, error };
};

export default useCameras;
