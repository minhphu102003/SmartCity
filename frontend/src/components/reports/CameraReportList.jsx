import React from 'react';
import CameraReportSkeleton from './CameraReportSkeleton';
import { useCameraReports } from '../../hooks/useCameraReports';
import CameraReportItem from './CameraReportItem';
import { Pagination } from '../common';

const CameraReportList = () => {
  const {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useCameraReports(1, 10);

  if (loading) {
    return (
      <ul>
        {Array.from({ length: 4 }).map((_, i) => (
          <CameraReportSkeleton key={i} />
        ))}
      </ul>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center mt-6">
        {error}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-center text-gray-600">
        <img
          src="https://www.123rf.com/photo_100130939_error-404-page-not-found-error-with-glitch-effect-on-screen-vector-illustration-for-your-design.html"
          alt="No reports"
          className="w-40 h-40 mb-4 opacity-70"
        />
        <p className="text-lg font-medium">No camera reports available.</p>
      </div>
    );
  }

  return (
    <>
      <ul>
        {data.map((item) => (
          <CameraReportItem key={item._id} report={item} />
        ))}
      </ul>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default CameraReportList;
