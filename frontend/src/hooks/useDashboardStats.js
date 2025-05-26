import { useState, useEffect } from 'react';
import { getListUser } from '../services/user';
import { getAccountReport } from '../services/report';
import { searchPlaceByName } from '../services/place';
import { getCameras } from '../services/camera';

const useDashboardStats = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    reportCount: 0,
    placeCount: 0,
    cameraCount: 0
  });

  const [loading, setLoading] = useState({
    user: false,
    report: false,
    place: false,
    camera: false
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(prev => ({ ...prev, user: true }));
      try {
        const result = await getListUser();
        console.log(result);
        if (result?.success) {
          setStats(prev => ({ ...prev, userCount: result.total }));
        }
      } finally {
        setLoading(prev => ({ ...prev, user: false }));
      }
    };

    const fetchReports = async () => {
      setLoading(prev => ({ ...prev, report: true }));
      try {
        const result = await getAccountReport({ limit: 50 });
        setStats(prev => ({ ...prev, reportCount: result?.total || 0 }));
      } finally {
        setLoading(prev => ({ ...prev, report: false }));
      }
    };

    const fetchPlaces = async () => {
      setLoading(prev => ({ ...prev, place: true }));
      try {
        const result = await searchPlaceByName();
        setStats(prev => ({ ...prev, placeCount: result?.total }));
      } finally {
        setLoading(prev => ({ ...prev, place: false }));
      }
    };

    const fetchCamera = async () => {
      setLoading(prev => ({ ...prev, camera: true }));
      try {
        const result = await getCameras();
        if (result?.success) {
          setStats(prev => ({ ...prev, cameraCount: result.total }));
        }
      } finally {
        setLoading(prev => ({ ...prev, camera: false }));
      }
    };

    fetchUsers();
    fetchReports();
    fetchPlaces();
    fetchCamera();
  }, []);

  return {
    stats,
    loading
  };
};

export default useDashboardStats; 