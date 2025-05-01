import { FaUserClock } from 'react-icons/fa';
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { FaPlaceOfWorship } from "react-icons/fa6";
import useDashboardStats from '../../hooks/useDashboardStats';
import BarChart from '../../components/chart/BarChart';

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
  const { stats, loading } = useDashboardStats();

  return (
    <div className="p-5">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-3">
          <StatBox
            isLoading={loading.user}
            title={stats.userCount.toLocaleString()}
            subtitle="User"
            progress="0.75"
            increase="+14%"
            icon={<FaUserClock className="text-2xl text-green-500" />}
          />
        </div>
        <div className="col-span-3">
          <StatBox
            isLoading={loading.report}
            title={stats.reportCount.toLocaleString()}
            subtitle="User Report"
            progress="0.50"
            increase="+21%"
            icon={<MdOutlineReportGmailerrorred className="text-2xl text-green-500" />}
          />
        </div>
        <div className="col-span-3">
          <StatBox
            isLoading={loading.place}
            title={stats.placeCount.toLocaleString()}
            subtitle="Places"
            progress="0.30"
            increase="+5%"
            icon={<FaPlaceOfWorship className="text-2xl text-green-500" />}
          />
        </div>
        <div className="col-span-3">
          <StatBox
            isLoading={loading.camera}
            title={stats.cameraCount.toLocaleString()}
            subtitle="Camera"
            progress="0.50"
            increase="+21%"
            icon={<MdOutlineReportGmailerrorred className="text-2xl text-green-500" />}
          />
        </div>
      </div>

      {/* Add BarChart below the statistics */}
      <div className="mt-5">
        <div className="rounded-xl bg-gray-800 p-4 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-white">Statistics Overview</h2>
          <BarChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
