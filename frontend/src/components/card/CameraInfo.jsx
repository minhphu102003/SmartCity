import React from 'react';

const CameraInfo = ({ icon, date }) => {
  return (
    <>
      <div className="absolute right-2 top-3 flex items-center gap-2 rounded-xl bg-black/50 px-3 py-0.5">
        <div className="h-2 w-2 rounded-full bg-red-500"></div>
        <span className="text-sm font-thin text-white">Live</span>
      </div>
      <div className="absolute left-2 top-3 flex items-center gap-1 rounded-xl bg-black/50 px-2 py-0.5">
        <span className="text-sm font-thin text-white">Camera</span>
      </div>
      <div className="absolute left-2 bottom-5 flex items-center gap-1 rounded-lg bg-black/50 px-2 py-1">
        {icon}
        <span className="text-sm text-white">{date}</span>
      </div>
    </>
  );
};

export default CameraInfo;
