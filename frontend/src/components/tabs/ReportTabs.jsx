import React from 'react';

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex w-full border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 text-center px-4 py-2 font-medium transition-colors duration-200 
            ${activeTab === tab.id
              ? 'border-b-2 border-blue-600 text-blue-600 bg-white'
              : 'text-gray-500 hover:text-blue-500 bg-gray-100'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
