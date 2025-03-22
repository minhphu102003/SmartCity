import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      <p className="ml-3 text-white text-lg">Loading cameras...</p>
    </div>
  );
};

export default Loading;
