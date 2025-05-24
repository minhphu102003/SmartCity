'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReportCard from '../../components/card/ReportCard';
import ReportHeader from '../../components/card/ReportHeader';
import Loading from '../../components/common/Loading';
import ErrorComponent from '../../components/common/ErrorComponent';
import { AlertTriangle, FileText } from 'lucide-react';
import ReportModal from '../../components/modals/ReportModal';
import { toast } from 'react-toastify';
import { getAccountReport } from '../../services/report';

const Report = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await getAccountReport({analysisStatus: true, guest: true});
        console.log('API Response:', response);

        if (response.success && response.data) {
          const transformedReports = response.data.map((report) => ({
            id: report.reportId,
            user: {
              name: report.username,
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${report.username}`,
              roles: report.roles || [],
            },
            content: report.description,
            images: report.imgs?.map((img) => img.img) || [],
            status: report.typeReport,
            createdAt: report.createdAt,
            location: `${report.latitude}, ${report.longitude}`,
            congestionLevel: report.congestionLevel,
            analysisStatus: report.analysisStatus,
            originalData: report,
          }));

          console.log('Transformed Reports:', transformedReports);
          setReports(transformedReports);
          setError(null);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
        setError('Failed to load reports. Please try again later.');
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    if (!Array.isArray(reports)) {
      return [];
    }

    return reports.filter((report) => {
      const content = report?.content?.toLowerCase() || '';
      const location = report?.location?.toLowerCase() || '';
      const searchLower = searchTerm.toLowerCase();

      const matchesSearch =
        !searchTerm ||
        content.includes(searchLower) ||
        location.includes(searchLower);

      const matchesStatus = !selectedStatus || report.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [reports, searchTerm, selectedStatus]);

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setReportModalOpen(true);
  };

  // const handleReportSubmit = async (reportData) => {
  //   try {
  //     setLoading(true);
  //     await reportService.submitReport({
  //       reportId: reportData.reportedContent.id,
  //       reason: reportData.reason,
  //       description: reportData.customReason,
  //     });
  //     toast.success('Report submitted successfully');
  //     setReportModalOpen(false);
  //   } catch (error) {
  //     console.error('Error submitting report:', error);
  //     toast.error('Failed to submit report. Please try again later.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-emerald-500" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                User Posts
              </h1>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredReports.length} reports found
            </div>
          </div>

          <ReportHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </motion.div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800">
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center p-8"
              >
                <Loading />
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8"
              >
                <ErrorComponent message={error} />
              </motion.div>
            )}

            {!loading && !error && filteredReports.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center p-12 text-center"
              >
                <AlertTriangle className="mb-4 h-12 w-12 text-amber-500" />
                <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-gray-100">
                  No Reports Found
                </h3>
                <p className="max-w-md text-gray-500 dark:text-gray-400">
                  No reports match your search criteria. Please try different
                  filters.
                </p>
              </motion.div>
            )}

            {!loading && !error && filteredReports.length > 0 && (
              <>
                {filteredReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    variants={item}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                    }}
                    whileHover={{
                      scale: 1.01,
                      transition: { duration: 0.2 },
                    }}
                    className="dark:hover:bg-gray-750 z-50 p-4 transition-colors duration-150 hover:bg-gray-50"
                  >
                    <ReportCard
                      report={report}
                      onReport={() => handleReportClick(report)}
                    />
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        reportedContent={selectedReport}
      /> */}
    </div>
  );
};

export default Report;
