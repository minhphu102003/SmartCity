import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm border border-blue-500 text-blue-600 rounded hover:bg-blue-50 disabled:opacity-50"
      >
        First
      </button>

      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm border border-blue-500 text-blue-600 rounded hover:bg-blue-50 disabled:opacity-50"
      >
        Prev
      </button>

      <span className="px-4 text-sm font-medium text-gray-700">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm border border-blue-500 text-blue-600 rounded hover:bg-blue-50 disabled:opacity-50"
      >
        Next
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm border border-blue-500 text-blue-600 rounded hover:bg-blue-50 disabled:opacity-50"
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
