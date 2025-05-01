import React, { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { getCurrentTime } from '../../utils/timeUtils';
import CameraVideo from './CameraVideo';
import CameraInfo from './CameraInfo';
import { fetchAddress } from '../../services/openCageService';

const CameraCard = ({ videoUrl, isActive, onPlay, longitude, latitude }) => {
  const { icon, date } = getCurrentTime();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  const handleFetchAddress = async () => {
    setLoading(true);
    try {
      const fetchedAddress = await fetchAddress(latitude, longitude);
      setAddress(fetchedAddress);
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Error fetching address');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchAddress();
  }, []);

  return (
    <div className="min-h-[300px] min-w-[400px] rounded-xl bg-zinc-700">
      <div className="flex flex-col gap-2 px-6 py-2">
        <div className="flex items-center justify-between">
          <h1 className="line-clamp-2 overflow-hidden text-ellipsis whitespace-normal text-xl font-semibold text-white">
            {loading ? 'Fetching address...' : address}
          </h1>
          <FaArrowRight className="text-white" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          <p className="text-[12px] font-thin text-white">Active</p>
        </div>

        <div className="relative pb-2">
          <CameraVideo
            videoUrl={videoUrl}
            isPlaying={isActive}
            onPlay={onPlay}
          />
          {!isActive && <CameraInfo icon={icon} date={date} />}
        </div>
      </div>
    </div>
  );
};

export default CameraCard;
