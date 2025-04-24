import { FaUserClock } from 'react-icons/fa';
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { getListUser } from '../../services/user';
import { useEffect, useState } from 'react';
import { getAccountReport } from '../../services/report';
import { FaPlaceOfWorship } from "react-icons/fa6";
import { searchPlaceByName } from '../../services/place';
import { getCameras } from '../../services/camera';

const StatBox = ({ title, subtitle, progress, increase, icon, isLoading }) => (
  <div className="flex h-full flex-col items-center justify-center rounded-xl bg-gray-800 p-4 shadow-lg">
    {isLoading ? (
      <div className="flex h-full flex-col items-center justify-center space-y-2">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
        <p className="text-sm text-gray-300">Loading...</p>
      </div>
    ) : (
      <>
        <div className="flex items-center space-x-3">
          {icon}
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-sm text-gray-400">{subtitle}</p>
        <p className="text-xs text-green-400">{increase}</p>
      </>
    )}
  </div>
);

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [placeCount, setPlaceCount] = useState(0);
  const [cameraCount, setCameraCount] = useState(0);

  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [isLoadingPlace, setIsLoadingPlace] = useState(false);
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUser(true);
      try {
        const result = await getListUser();
        if (result?.success) {
          setUserCount(result.total);
        }
      } finally {
        setIsLoadingUser(false);
      }
    };

    const fetchReports = async () => {
      setIsLoadingReport(true);
      try {
        const result = await getAccountReport();
        setReportCount(result?.total || 0);
      } finally {
        setIsLoadingReport(false);
      }
    };

    const fetchPlaces = async () => {
      setIsLoadingPlace(true);
      try {
        const result = await searchPlaceByName();
        console.log(result);
        setPlaceCount(result?.total);
      } finally {
        setIsLoadingPlace(false);
      }
    };

    const fetchCamera = async () => {
      setIsLoadingCamera(true);
      try {
        const result = await getCameras();
        if (result?.success) {
          setCameraCount(result.total);
        }
      } finally {
        setIsLoadingCamera(false);
      }
    };

    fetchUsers();
    fetchReports();
    fetchPlaces(); 
    fetchCamera();
  }, []);
  return (
    <div className="p-5">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-3">
          <StatBox
            isLoading={isLoadingUser}
            title={userCount.toLocaleString()}
            subtitle="User"
            progress="0.75"
            increase="+14%"
            icon={<FaUserClock className="text-2xl text-green-500" />}
          />
        </div>
        <div className="col-span-3">
          <StatBox
            isLoading={isLoadingReport}
            title={reportCount.toLocaleString()}
            subtitle="User Report"
            progress="0.50"
            increase="+21%"
            icon={<MdOutlineReportGmailerrorred className="text-2xl text-green-500" />}
          />
        </div>
        <div className="col-span-3">
          <StatBox
            isLoading={isLoadingPlace}
            title={placeCount.toLocaleString()}
            subtitle="Places"
            progress="0.30"
            increase="+5%"
            icon={<FaPlaceOfWorship className="text-2xl text-green-500" />}
          />
        </div>
        <div className="col-span-3">
          <StatBox
            isLoading={isLoadingCamera}
            title={cameraCount.toLocaleString()}
            subtitle="Camera"
            progress="0.50"
            increase="+21%"
            icon={<MdOutlineReportGmailerrorred className="text-2xl text-green-500" />}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
