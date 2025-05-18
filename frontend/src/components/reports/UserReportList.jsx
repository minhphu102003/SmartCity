import React, { useState } from 'react';
import { useAccountReports } from '../../hooks/useAccountReports';
import UserReportItem from './UserReportItem';
import { Pagination } from '../common';
import { ReportTypes, CongestionLevels } from '../../constants';

const UserReportList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({
    typeReport: '',
    congestionLevel: '',
    hasReview: false,
  });

  const { reports, loading, error, pagination } = useAccountReports(page, limit, filters);
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
    <div>
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          name="typeReport"
          value={filters.typeReport}
          onChange={handleFilterChange}
          className="border rounded px-3 py-1"
        >
          <option value="">All Types</option>
          {Object.entries(ReportTypes).map(([key, value]) => (
            <option key={key} value={value}>
              {value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
            </option>
          ))}
        </select>

        <select
          name="congestionLevel"
          value={filters.congestionLevel}
          onChange={handleFilterChange}
          className="border rounded px-3 py-1"
        >
          <option value="">All Congestion</option>
          {Object.entries(CongestionLevels).map(([key, value]) => (
            <option key={key} value={value}>
              {value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
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
};

export default UserReportList;