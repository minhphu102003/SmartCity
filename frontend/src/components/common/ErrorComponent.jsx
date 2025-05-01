import React from "react";
import { MdErrorOutline } from "react-icons/md";
import { IoReload } from "react-icons/io5";

const ErrorComponent = ({ message, onRetry, title = "Error Loading Data" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2">
          <MdErrorOutline className="text-4xl text-red-500" />
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        
        <p className="text-gray-400 text-center max-w-md">{message}</p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
          >
            <IoReload className="text-lg" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorComponent;