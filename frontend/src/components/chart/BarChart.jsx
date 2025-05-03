import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';

import { getAccountReport } from '../../services/report';
import { getCameraReport } from '../../services/cameraReport';
import ReportMap  from '../map/ReportMap';

const transformReportData = (reportData, cameraData) => {
  const allReports = [
    ...reportData,
    ...cameraData.map((item) => ({
      timestamp: item.timestamp,
      typeReport: item.typeReport,
    })),
  ];

  const result = {};

  allReports.forEach(({ timestamp, typeReport }) => {
    const dateObj = new Date(timestamp);
    const month = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;

    if (!result[month])
      result[month] = { date: month, trafficJam: 0, flood: 0 };

    if (typeReport === 'TRAFFIC_JAM') {
      result[month].trafficJam += 1;
    } else if (typeReport === 'FLOOD') {
      result[month].flood += 1;
    }
  });

  return Object.values(result).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
};

const extractMapPoints = (reportData, cameraData) => {
  return [
    ...reportData
      .filter((r) => r.latitude && r.longitude)
      .map((r) => ({
        lat: r.latitude,
        lng: r.longitude,
        type: r.typeReport,
        timestamp: r.timestamp,
      })),
    ...cameraData
      .filter((r) => r.latitude && r.longitude)
      .map((r) => ({
        lat: r.latitude,
        lng: r.longitude,
        type: r.typeReport,
        timestamp: r.timestamp,
      })),
  ];
};

const ReportLineChart = () => {
  const [data, setData] = useState([]);
  const [mapPoints, setMapPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const [accountRes, cameraRes] = await Promise.all([
          getAccountReport(1, 100),
          getCameraReport(1, 100),
        ]);
        const transformed = transformReportData(
          accountRes.data,
          cameraRes.data
        );
        const points = extractMapPoints(accountRes.data, cameraRes.data);
        setData(transformed);
        setMapPoints(points);
      } catch (error) {
        console.error('Failed to fetch reports', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <div className="p-4 text-white">Loading data...</div>;
  }

  return (
    <>
      <div className="h-[400px] w-full rounded-xl bg-gray-800 p-4 shadow-lg">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
            <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #4B5563',
                color: '#9CA3AF',
              }}
            />
            <Legend wrapperStyle={{ color: '#9CA3AF', paddingTop: '20px' }} />
            <Line
              type="monotone"
              dataKey="trafficJam"
              stroke="#38BCB2"
              name="Traffic Jam"
            />
            <Line
              type="monotone"
              dataKey="flood"
              stroke="#FF6B6B"
              name="Flood"
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
      <ReportMap points={mapPoints} />
    </>
  );
};

export default ReportLineChart;
