import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBar = () => {
  return (
    <div className="flex w-[30%] items-center gap-2 rounded-xl bg-white px-2 py-1 shadow-md">
      <input
        type="text"
        placeholder="Tìm kiếm địa điểm..."
        className="flex-1 px-4 py-2 outline-none"
      />
      {/* Nút tìm kiếm */}
      <button className="flex h-[5vh] w-[40px] items-center justify-center rounded-lg px-2 text-black hover:text-blue-600">
        <FontAwesomeIcon icon={faSearch} />
      </button>
      {/* Nút tìm đường đi */}
      <button className="flex h-[5vh] w-[40px] items-center justify-center rounded-lg px-2 text-black hover:text-green-600">
      <FontAwesomeIcon icon={faRoute} className="text-blue-500 text-lg" />
      </button>
    </div>
  );
};

export default SearchBar;
