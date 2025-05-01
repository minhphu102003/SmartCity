import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockBarData as data } from "../data/mockData";

const BarChart = ({ isDashboard = false }) => {

  const transformedData = data.map(item => ({
    country: item.country,
    'Hot Dog': item['hot dog'],
    'Burger': item.burger,
    'Sandwich': item.sandwich,
    'Kebab': item.kebab,
    'Fries': item.fries,
    'Donut': item.donut
  }));

  const colors = ['#38BCB2', '#EED312', '#FF6B6B', '#4ECDC4', '#FFD93D', '#FF8B8B'];

  return (
    <div className="h-[400px] w-full bg-gray-800 rounded-xl p-4 shadow-lg">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={transformedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
          <XAxis 
            dataKey="country" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937',
              border: '1px solid #4B5563',
              color: '#9CA3AF'
            }}
          />
          <Legend 
            wrapperStyle={{
              color: '#9CA3AF',
              paddingTop: '20px'
            }}
          />
          <Bar dataKey="Hot Dog" fill={colors[0]} />
          <Bar dataKey="Burger" fill={colors[1]} />
          <Bar dataKey="Sandwich" fill={colors[2]} />
          <Bar dataKey="Kebab" fill={colors[3]} />
          <Bar dataKey="Fries" fill={colors[4]} />
          <Bar dataKey="Donut" fill={colors[5]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
