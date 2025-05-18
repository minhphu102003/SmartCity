import { useEffect, useState } from 'react';
import { getCameraReport } from '../services/cameraReport';

export const useCameraReports = (initialPage = 1, limit = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getCameraReport(currentPage, limit);
        setData(res?.data || []);
        setTotalPages(res?.totalPages || 1);
        setTotalCount(res?.total || 0);
      } catch (err) {
        setError('Failed to fetch camera reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [currentPage, limit]);

  return {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    setCurrentPage,
  };
};
