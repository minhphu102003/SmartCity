"use client"
import { useState } from "react"
import { useAccountReports } from "../../hooks/useAccountReports"
import UserReportItem from "./UserReportItem"
import { Pagination } from "../common"
import { ReportTypes } from "../../constants"
import ReportReviewSection from "./ReportReviewSection"

const UserReportList = () => {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    typeReport: "",
    hasReview: false,
  })

  const { reports, loading, error, pagination } = useAccountReports(page, 10, filters)
  const filteredReports = reports.filter((report) => report.imgs?.length > 0)

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    setPage(1)
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-2xl p-6 border border-purple-100 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
            User Reports Dashboard
          </h1>
        </div>
        <p className="text-gray-600">Manage and review user-submitted reports with advanced filtering</p>
      </div>

      {/* Chart + Filter UI grouped together with enhanced styling */}
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
        {/* Chart section with enhanced container */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Report Analytics</h3>
            </div>
            <div className="p-6">
              <ReportReviewSection />
            </div>
          </div>
        </div>

        {/* Enhanced Filter Section */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 min-h-[400px] overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                  />
                </svg>
                <h3 className="font-semibold text-gray-800">Filters & Controls</h3>
              </div>
            </div>

            <div className="p-6 flex flex-col justify-between h-full">
              <div className="space-y-6">
                {/* Filter Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center transform transition-all duration-200 hover:scale-105">
                    <div className="text-2xl font-bold text-blue-700">{filteredReports.length}</div>
                    <div className="text-sm text-blue-600">Filtered Results</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center transform transition-all duration-200 hover:scale-105">
                    <div className="text-2xl font-bold text-green-700">{pagination.total}</div>
                    <div className="text-sm text-green-600">Total Reports</div>
                  </div>
                </div>

                {/* Active Filters Indicator */}
                {(filters.typeReport || filters.hasReview) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 animate-pulse">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <span className="text-sm font-medium">Filters Active</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Filter Controls */}
              <div className="space-y-4 mt-auto">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Report Type</label>
                  <select
                    name="typeReport"
                    value={filters.typeReport}
                    onChange={handleFilterChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-gray-300"
                  >
                    <option value="">🔍 All Types</option>
                    {Object.entries(ReportTypes).map(([key, value]) => (
                      <option key={key} value={value}>
                        📋{" "}
                        {value
                          .replace(/_/g, " ")
                          .toLowerCase()
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:bg-gray-100 transition-all duration-200">
                  <span className="text-sm font-medium text-gray-700">Show only reviewed reports</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="hasReview"
                      checked={filters.hasReview}
                      onChange={handleFilterChange}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Clear Filters Button */}
                {(filters.typeReport || filters.hasReview) && (
                  <button
                    onClick={() => {
                      setFilters({ typeReport: "", hasReview: false })
                      setPage(1)
                    }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-medium transform transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content Section */}
      {loading && (
        <div className="space-y-4">
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
            </div>
            <div className="ml-4">
              <div className="text-lg font-semibold text-gray-700 animate-pulse">Loading user reports...</div>
              <div className="text-sm text-gray-500">Please wait while we fetch the data</div>
            </div>
          </div>

          {/* Loading skeletons */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div className="flex space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="text-center p-8 max-w-md mx-auto">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center animate-bounce">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full animate-ping opacity-75"></div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Reports</h3>
              <p className="text-red-600 leading-relaxed mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium transform transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Retry Loading
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && !filteredReports.length && (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
          <div className="relative mb-8">
            {/* Animated background */}
            <div className="absolute inset-0 -m-6">
              <div className="w-40 h-40 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full animate-pulse opacity-60"></div>
            </div>
            <div className="absolute inset-0 -m-3">
              <div
                className="w-34 h-34 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full animate-pulse opacity-40"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>

            {/* Main icon */}
            <div className="relative w-28 h-28 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110">
              <svg className="w-14 h-14 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>

          <div className="max-w-lg mx-auto">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-3">
              No Reports Found
            </h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              {filters.typeReport || filters.hasReview
                ? "No reports match your current filters. Try adjusting your search criteria."
                : "No user reports are available at the moment. Reports will appear here once users start submitting them."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {(filters.typeReport || filters.hasReview) && (
                <button
                  onClick={() => {
                    setFilters({ typeReport: "", hasReview: false })
                    setPage(1)
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg font-medium transform transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium transform transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 active:scale-95"
              >
                Refresh Page
              </button>
            </div>
          </div>

          {/* Floating elements */}
          <div
            className="absolute top-20 left-10 w-3 h-3 bg-purple-300 rounded-full animate-bounce opacity-60"
            style={{ animationDelay: "0s", animationDuration: "3s" }}
          ></div>
          <div
            className="absolute top-32 right-16 w-2 h-2 bg-blue-300 rounded-full animate-bounce opacity-40"
            style={{ animationDelay: "1s", animationDuration: "4s" }}
          ></div>
          <div
            className="absolute bottom-32 left-20 w-4 h-4 bg-indigo-300 rounded-full animate-bounce opacity-50"
            style={{ animationDelay: "2s", animationDuration: "5s" }}
          ></div>
        </div>
      )}

      {!loading && filteredReports.length > 0 && (
        <>
          {/* Results header */}
          <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-gray-700">
                Showing {filteredReports.length} of {reports.length} reports
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
          </div>

          {/* Enhanced Reports List */}
          <ul className="space-y-6">
            {filteredReports.map((report, index) => (
              <div
                key={report.reportId}
                className="transform transition-all duration-500 ease-out hover:scale-[1.01] hover:shadow-lg"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: "slideInFromRight 0.6s ease-out forwards",
                }}
              >
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                  <UserReportItem report={report} />
                </div>
              </div>
            ))}
          </ul>

          {/* Enhanced Pagination */}
          <div className="mt-8 flex justify-center">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default UserReportList
