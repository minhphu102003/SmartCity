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
  const [predictions, setPredictions] = useState([]);

  const { messages } = useWebSocket();

  const fetchCameras = async () => {
    if (!userLocation) return;
    try {
      const response = await getCameras({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        distance: 5,
        page: 1,
        limit: 50,
      });
      setCameras(response?.data || []);
    } catch (error) {
      console.error('Error fetching cameras:', error);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, [userLocation]);

  useEffect(() => {
  const interval = setInterval(() => {
    const currentTime = Date.now();


    setPredictions((prevPredictions) => {
      const filtered = prevPredictions.filter((prediction) => {
        const predictionTime = new Date(prediction.timestamp).getTime();
        const elapsedTime = (currentTime - predictionTime) / 1000/ 60; 
        const shouldKeep = elapsedTime <= 60;
        return shouldKeep;
      });
      console.log(`✅ Remaining predictions: ${filtered.length}`);
      return filtered;
    });

    setReports((prevReports) => {
      if (prevReports.length === 0) return prevReports;

      const filteredReports = prevReports.filter((report) => {
        const reportTime = new Date(report.timestamp).getTime();
        const elapsedMinutes = (currentTime - reportTime) / 1000 / 60;

        if (report.typeReport?.startsWith('t')) {
          return elapsedMinutes <= 10;
        } else {
          return elapsedMinutes <= 45;
        }
      });

      console.log(`✅ Remaining reports: ${filteredReports.length}`);
      return filteredReports;
    });
  }, 60000);

  return () => clearInterval(interval);
}, []);



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

    if (lastMessage.type === 'predict') {
      const { roadSegment, timestamp } = lastMessage.data;

      const coords = roadSegment.roadSegmentLine.coordinates.map(
        ([lng, lat]) => ({
          lat,
          lng,
        })
      );

      const newPrediction = {
        id: uuidv4(),
        coordinates: coords,
        groundwater_level: roadSegment.groundwater_level,
        near_river: roadSegment.near_river,
        timestamp,
      };

      setPredictions((prev) => [...prev, newPrediction]);
    }

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

  return {
    cameras,
    predictions,
    reports,
    shouldShake,
    latestMessage,
    setCameras,
    refetchCameras: fetchCameras,
  };
};
