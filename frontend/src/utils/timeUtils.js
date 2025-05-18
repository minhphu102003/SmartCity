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

export const timeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = Math.floor((now - time) / 1000);

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 31104000) return `${Math.floor(diff / 2592000)} months ago`;
  return `${Math.floor(diff / 31104000)} years ago`;
};