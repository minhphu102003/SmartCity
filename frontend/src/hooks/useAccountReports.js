import { useEffect, useState } from 'react';
import { getAccountReport } from '../services/report';

export const useAccountReports = (page = 1, limit= 10 , filters = {}) => {
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    count: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);

        const params = {
          page,
          limit,
          ...filters,
        };

        Object.keys(params).forEach((key) => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key];
          }
        });

        const res = await getAccountReport(params);

        setReports(res?.data || []);
        setPagination({
          total: res?.total,
          count: res?.count,
          totalPages: res?.totalPages,
          currentPage: res?.currentPage,
        });
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch account reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [page, JSON.stringify(filters)]);

  return { reports, loading, error, pagination };
};


export const useAllAccountReports = () => {
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllReports = async () => {
      try {
        setLoading(true);
        let page = 1;
        const limit = 100;
        let reports = [];
        let totalPages = 1;

        while (page <= totalPages) {
          const res = await getAccountReport({ page, limit });
          if (res?.data?.length > 0) {
            reports = [...reports, ...res.data];
            totalPages = res.totalPages;
            page++;
          } else {
            break;
          }
        }

        setAllReports(reports);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch all reports');
      } finally {
        setLoading(false);
      }
    };

    fetchAllReports();
  }, []);
  return { reports: allReports, loading, error };
};