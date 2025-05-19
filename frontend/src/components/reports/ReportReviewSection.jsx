import { useEffect, useState } from 'react';
import { useAllAccountReports } from '../../hooks/useAccountReports';
import { ReportReviewChart } from '../chart';
import { getReviewStats } from '../../utils/review';

const ReportReviewSection = () => {
  const { reports: Allreports, loading: Allloading } = useAllAccountReports();
  const [reviewStats, setReviewStats] = useState([]);

  useEffect(() => {
    if (!Allloading && Allreports.length > 0) {
      const stats = getReviewStats(Allreports);
      setReviewStats(stats);
    }
  }, [Allloading, Allreports]);

  if (Allloading) return <p className="text-center">Loading chart...</p>;

  return (
    <div className="my-6">
      <ReportReviewChart data={reviewStats} />
    </div>
  );
};

export default ReportReviewSection;
