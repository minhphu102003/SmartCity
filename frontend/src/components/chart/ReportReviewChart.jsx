import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#34D399', '#F87171', '#FBBF24', '#9CA3AF'];
// Green for Approved, Red for Rejected, Yellow for Pending, Gray for Unreviewed

const ReportReviewChart = ({ data }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white shadow rounded-lg">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Report Review Summary
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            dataKey="value"
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportReviewChart;
