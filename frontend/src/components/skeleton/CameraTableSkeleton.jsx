import React from 'react';

const CameraTableSkeleton = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">Camera Management</h1>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Link</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Address</th>
              <th className="px-4 py-3 text-left font-semibold">Installation Date</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="border border-gray-200 px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </td>
                <td className="border border-gray-200 px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                </td>
                <td className="border border-gray-200 px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </td>
                <td className="border border-gray-200 px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </td>
                <td className="border border-gray-200 px-4 py-3">
                  <div className="flex space-x-2 justify-center">
                    <div className="h-6 bg-gray-200 rounded w-12" />
                    <div className="h-6 bg-gray-200 rounded w-12" />
                    <div className="h-6 bg-gray-200 rounded w-12" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CameraTableSkeleton;