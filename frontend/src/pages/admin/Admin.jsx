import { Email, PointOfSale, PersonAdd } from "@mui/icons-material";

const StatBox = ({ title, subtitle, progress, increase, icon }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-xl shadow-lg">
    <div className="flex items-center space-x-3">
      {icon}
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    <p className="text-sm text-gray-400">{subtitle}</p>
    <p className="text-xs text-green-400">{increase}</p>
  </div>
);

const Dashboard = () => {
  return (
    <div className="p-5">
      {/* GRID & CHARTS */}
      <div className="grid grid-cols-12 gap-5">
        {/* ROW 1 */}
        <div className="col-span-3">
          <StatBox
            title="12,361"
            subtitle="Emails Sent"
            progress="0.75"
            increase="+14%"
            icon={<Email className="text-green-500 text-2xl" />}
          />
        </div>
        <div className="col-span-3">
          <StatBox
            title="431,225"
            subtitle="Sales Obtained"
            progress="0.50"
            increase="+21%"
            icon={<PointOfSale className="text-green-500 text-2xl" />}
          />
        </div>
        <div className="col-span-3">
          <StatBox
            title="32,441"
            subtitle="New Clients"
            progress="0.30"
            increase="+5%"
            icon={<PersonAdd className="text-green-500 text-2xl" />}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
