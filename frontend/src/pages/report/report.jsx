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

// Mock data - Thay thế bằng API call thực tế
const mockReports = [
  {
    id: 1,
    user: {
      name: "Nguyễn Văn A",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    content: "Kẹt xe nghiêm trọng tại ngã tư Nguyễn Văn Linh",
    images: ["https://picsum.photos/400/300?random=1", "https://picsum.photos/400/300?random=2"],
    status: "Kẹt xe",
    createdAt: "2024-04-13T10:30:00",
    location: "Ngã tư Lê Văn Lương - Tố Hữu",
  },
  {
    id: 2,
    user: {
      name: "Trần Thị B",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    content: "Lũ lụt tại khu vực Trần Cao Vân",
    images: ["https://picsum.photos/400/300?random=3"],
    status: "Lũ lụt",
    createdAt: "2024-04-13T09:15:00",
    location: "Phường Thanh Xuân",
  },
]

const Report = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reports, setReports] = useState(mockReports)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)

  // Debug logs
  useEffect(() => {
    console.log('Current State:', {
      loading,
      error,
      reportsCount: reports.length,
      searchTerm,
      selectedStatus
    });
  }, [loading, error, reports, searchTerm, selectedStatus]);

  const filteredReports = useMemo(() => {
    const filtered = reports.filter((report) => {
      const matchesSearch =
        report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = !selectedStatus || report.status === selectedStatus
      return matchesSearch && matchesStatus
    })
    console.log('Filtered Reports:', filtered);
    return filtered;
  }, [reports, searchTerm, selectedStatus])

  const handleCreateReport = () => {
    
    console.log("Create new report")
  }

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setReportModalOpen(true);
  };

  const handleReportSubmit = async (reportData) => {
    try {
      
      console.log('Submitting report:', reportData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Báo cáo đã được gửi thành công');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Không thể gửi báo cáo. Vui lòng thử lại sau.');
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
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Bài viết từ người dùng</h1>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredReports.length} báo cáo được tìm thấy
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
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">Không tìm thấy báo cáo</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Không có báo cáo nào phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại với các bộ lọc khác.
                </p>
              </motion.div>
            )}

            {!loading && !error && filteredReports.length > 0 && (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="divide-y divide-gray-200 dark:divide-gray-700"
              >
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
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
                  >
                    <ReportCard report={report} onReport={() => handleReportClick(report)} />
                  </motion.div>
                ))}
              </motion.div>
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