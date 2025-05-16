import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useWebSocket } from '../websocket/hooks';
import { getCameras } from '../services/camera';
import { getRecentReports } from '../services/report';
import { formatReports } from '../utils/formatReports';
import { haversineDistance } from '../utils/distances';

export const useFloodData = (userLocation) => {
  const [cameras, setCameras] = useState([]);
  const [reports, setReports] = useState([]);
  const [latestMessage, setLatestMessage] = useState(null);
  const [shouldShake, setShouldShake] = useState(false);

  const { messages } = useWebSocket();

  useEffect(() => {
    const fetchCameras = async () => {
      if (!userLocation) return;
      try {
        const response = await getCameras({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          distance: 5,
          page: 1,
          limit: 20,
        });
        setCameras(response?.data || []);
      } catch (error) {
        console.error('Error fetching cameras:', error);
      }
    };

    fetchCameras();
  }, [userLocation]);

  useEffect(() => {
    const fetchReports = async () => {
      if (!userLocation) return;
      try {
        const response = await getRecentReports();
        const formattedReports = formatReports(response?.data, userLocation);
        setReports(formattedReports);
      } catch (error) {
        console.error('Error while fetching report: ', error.message);
      }
    };

    fetchReports();
  }, [userLocation]);

  useEffect(() => {
    if (!userLocation || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage.latitude || !lastMessage.longitude) return;

    const distance = haversineDistance(
      userLocation.latitude,
      userLocation.longitude,
      lastMessage.latitude,
      lastMessage.longitude
    );

    const newReport = {
      ...lastMessage,
      distance,
      reportId: uuidv4(),
    };

    setShouldShake(true);
    setTimeout(() => setShouldShake(false), 600);

    setReports((prevReports) => [...prevReports, newReport]);
    setLatestMessage(newReport);
  }, [messages, userLocation]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (reports.length === 0) return;

      const currentTime = Date.now();

      const filteredReports = reports.filter((report) => {
        const reportTime = new Date(report.timestamp).getTime();
        const elapsedTime = (currentTime - reportTime) / 1000 / 60;

        if (report.typeReport?.startsWith('t')) {
          return elapsedTime <= 10;
        } else {
          return elapsedTime <= 45;
        }
      });

      setReports(filteredReports);
    }, 60000);

    return () => clearInterval(interval);
  }, [reports]);

  return {
    cameras,
    reports,
    shouldShake,
    latestMessage,
  };
};
