import { useEffect, useState } from 'react';
import { getAccountReport } from '../services/report'; 

export const useAccountReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await getAccountReport();
        setReports(res?.data || []);
      } catch (err) {
        setError('Failed to fetch account reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return { reports, loading, error };
};
