import React from "react";

const ErrorComponent = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-40 bg-red-500 text-white p-4 rounded-lg">
      <p className="text-lg font-semibold">Error Loading Cameras</p>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default ErrorComponent;