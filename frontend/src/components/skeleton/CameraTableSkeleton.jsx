const CameraTableSkeleton = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Camera Management</h1>
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Link</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Address</th>
            <th className="border px-2 py-1">Installation Date</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="animate-pulse text-center">
              {Array.from({ length: 5 }).map((__, i) => (
                <td key={i} className="border px-2 py-2">
                  <div className="h-4 bg-gray-300 rounded w-full mx-auto" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CameraTableSkeleton;
