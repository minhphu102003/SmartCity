import { useState } from 'react';
import { useAccountReports } from '../../hooks/useAccountReports';
import UserReportItem from './UserReportItem';
import { Pagination } from '../common';
import { ReportTypes } from '../../constants';
import ReportReviewSection from './ReportReviewSection';

const UserReportList = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    typeReport: '',
    hasReview: false,
  });

  const { reports, loading, error, pagination } = useAccountReports(page, 10, filters);
  const filteredReports = reports.filter((report) => report.imgs?.length > 0);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setPage(1);
  };


  return (
    <div className="space-y-6">
      {/* Chart + Filter UI grouped together */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
        {/* Chart section */}
        <div className="flex-1">
          <ReportReviewSection />
        </div>

        <div className="flex-1 flex flex-col justify-between bg-white p-4 rounded-lg shadow min-h-[400px]">
          <div className="mt-auto flex flex-wrap gap-4">
            <select
              name="typeReport"
              value={filters.typeReport}
              onChange={handleFilterChange}
              className="border rounded px-3 py-1"
            >
              <option value="">All Types</option>
              {Object.entries(ReportTypes).map(([key, value]) => (
                <option key={key} value={value}>
                  {value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="hasReview"
                checked={filters.hasReview}
                onChange={handleFilterChange}
              />
              Has Review
            </label>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      {loading && <p>Loading user reports...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !filteredReports.length && <p>No user reports found.</p>}

      {!loading && filteredReports.length > 0 && (
        <>
          <ul className="space-y-4">
            {filteredReports.map((report) => (
              <UserReportItem key={report.reportId} report={report} />
            ))}
          </ul>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}
    </div>
  );
}

export default UserReportList;