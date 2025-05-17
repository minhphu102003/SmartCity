const CameraReportSkeleton = () => (
  <li className="border p-4 mb-4 rounded shadow flex gap-4 animate-pulse">
    <div className="bg-gray-300 w-32 h-24 rounded" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-300 rounded w-2/3" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-4 bg-gray-300 rounded w-2/4" />
      <div className="h-4 bg-gray-300 rounded w-1/3" />
    </div>
  </li>
);

export default CameraReportSkeleton;