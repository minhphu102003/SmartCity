import { useEffect, useState } from 'react';
import { getCameraReport } from '../services/cameraReport';

export const useCameraReports = (page = 1, limit = 50) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const res = await getCameraReport(page, limit);
      setData(res?.data || []);
      setLoading(false);
    };

    fetchReports();
  }, [page, limit]);

  return { data, loading };
};
