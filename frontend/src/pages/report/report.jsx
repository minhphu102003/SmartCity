"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReportCard from "../../components/card/ReportCard"
import ReportHeader from "../../components/card/ReportHeader"
import Loading from "../../components/common/Loading"
import ErrorComponent from "../../components/common/ErrorComponent"
import { AlertTriangle, FileText } from "lucide-react"
import ReportModal from "../../components/modals/ReportModal"
import { toast } from "react-toastify"
import { reportService } from "../../services/reportService"

const Report = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reports, setReports] = useState([])
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await reportService.getAllReports();
        console.log('API Response:', response);

        if (response.success && response.data) {
          // Transform API data to match component structure
          const transformedReports = response.data.map(report => ({
            id: report.reportId,
            user: {
              name: report.username,
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${report.username}`,
              roles: report.roles || []
            },
            content: report.description,
            images: report.imgs?.map(img => img.img) || [],
            status: report.typeReport,
            createdAt: report.createdAt,
            location: `${report.latitude}, ${report.longitude}`,
            congestionLevel: report.congestionLevel,
            analysisStatus: report.analysisStatus,
            // Add original data for reference
            originalData: report
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
      
      const matchesSearch = !searchTerm || 
        content.includes(searchLower) ||
        location.includes(searchLower);
        
      const matchesStatus = !selectedStatus || 
        report.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [reports, searchTerm, selectedStatus]);

  const handleCreateReport = async (reportData) => {
    try {
      setLoading(true);
      await reportService.createReport({
        description: reportData.description,
        typeReport: 'TRAFFIC_JAM',
        congestionLevel: 'POSSIBLE_CONGESTION',
        longitude: reportData.longitude || 108.206012143132,
        latitude: reportData.latitude || 16.0754966720008,
        imgs: reportData.images
      });
      
      toast.success('Report created successfully');
      
      // Refresh reports
      const response = await reportService.getAllReports();
      if (response.success && response.data) {
        const transformedReports = response.data.map(report => ({
          id: report.reportId,
          user: {
            name: report.username,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${report.username}`,
            roles: report.roles || []
          },
          content: report.description,
          images: report.imgs?.map(img => img.img) || [],
          status: report.typeReport,
          createdAt: report.createdAt,
          location: `${report.latitude}, ${report.longitude}`,
          congestionLevel: report.congestionLevel,
          analysisStatus: report.analysisStatus,
          originalData: report
        }));
        
        setReports(transformedReports);
      }
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error('Failed to create report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setReportModalOpen(true);
  };

  const handleReportSubmit = async (reportData) => {
    try {
      setLoading(true);
      await reportService.submitReport({
        reportId: reportData.reportedContent.id,
        reason: reportData.reason,
        description: reportData.customReason
      });
      toast.success('Report submitted successfully');
      setReportModalOpen(false);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-emerald-500" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">User Posts</h1>
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
            onCreateReport={handleCreateReport}
          />
        </motion.div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 flex justify-center"
              >
                <Loading />
              </motion.div>
            )}

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8">
                <ErrorComponent message={error} />
              </motion.div>
            )}

            {!loading && !error && filteredReports.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 flex flex-col items-center justify-center text-center"
              >
                <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No Reports Found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  No reports match your search criteria. Please try different filters.
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
        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150 z-50"
      >
        <ReportCard report={report} onReport={() => handleReportClick(report)} />
      </motion.div>
    ))}
  </>
)}

           
          </AnimatePresence>
        </div>
      </div>

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        reportedContent={selectedReport}
      />
    </div>
  )
}

export default Report