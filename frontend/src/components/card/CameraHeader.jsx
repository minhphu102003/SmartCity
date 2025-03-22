import React from "react";
import { CITIES } from "../../constants";

const CameraHeader = ({ selectedCity, setSelectedCity, searchTerm, setSearchTerm }) => {
  return (
    <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow-md">
      <input
        type="text"
        placeholder="Tìm kiếm camera..."
        className="p-2 rounded-md bg-gray-700 text-white focus:outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        className="p-2 rounded-md bg-gray-700 text-white"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        {CITIES.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CameraHeader;
