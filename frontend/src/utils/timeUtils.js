import { WiSunrise, WiNightClear } from 'react-icons/wi';

export const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const isDaytime = hours >= 6 && hours < 18;
  const formattedDate = now.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

  return {
    icon: isDaytime ? (
      <WiSunrise size={18} className="text-yellow-300" />
    ) : (
      <WiNightClear size={18} className="text-blue-300" />
    ),
    date: formattedDate,
  };
};
