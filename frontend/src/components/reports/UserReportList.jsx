import React from 'react';
import { useAccountReports } from '../../hooks/useAccountReports';
import UserReportItem from './UserReportItem';

const UserReportList = () => {
  const { reports, loading, error } = useAccountReports();

  if (loading) return <p>Loading user reports...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const filteredReports = reports.filter((report) => report.imgs && report.imgs.length > 0);

  if (!filteredReports.length) return <p>No user reports found.</p>;

  return (
    <ul>
      {filteredReports.map((report) => (
        <UserReportItem key={report.reportId} report={report} />
      ))}
    </ul>
  );
};

export default UserReportList;
