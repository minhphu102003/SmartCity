"use client"
import CameraReportSkeleton from "./CameraReportSkeleton"
import { useCameraReports } from "../../hooks/useCameraReports"
import CameraReportItem from "./CameraReportItem"
import { Pagination } from "../common"

const CameraReportList = () => {
  const { data, loading, error, currentPage, totalPages, totalCount, setCurrentPage } = useCameraReports(1, 10)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Loading Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center animate-pulse">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <div className="h-6 w-48 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-lg animate-pulse"></div>
                <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Loading Cards */}
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg transform transition-all duration-500 ease-out"
                style={{
                  animationDelay: `${i * 150}ms`,
                  animation: "slideInFromRight 0.8s ease-out forwards",
                }}
              >
                <CameraReportSkeleton />
              </div>
            ))}
          </div>

          {/* Enhanced Loading Indicator */}
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-emerald-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin"></div>
              <div
                className="absolute top-2 left-2 w-12 h-12 border-4 border-transparent border-t-teal-400 rounded-full animate-spin"
                style={{ animationDirection: "reverse" }}
              ></div>
            </div>
            <div className="ml-4">
              <div className="text-lg font-semibold text-emerald-700 animate-pulse">Loading camera reports...</div>
              <div className="text-sm text-emerald-600">Fetching latest security data</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-red-50 flex items-center justify-center p-6">
        <div className="text-center p-8 max-w-lg mx-auto">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-rose-100 to-red-200 rounded-2xl flex items-center justify-center animate-bounce shadow-xl">
              <svg className="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 rounded-full animate-ping opacity-75"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-red-400 rounded-full animate-pulse"></div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-rose-200 rounded-2xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-bold text-rose-800">Connection Error</h3>
            </div>
            <p className="text-rose-600 leading-relaxed mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-xl font-medium transform transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Retry Connection
              </button>
              <button className="px-6 py-3 border-2 border-rose-300 text-rose-700 rounded-xl font-medium transform transition-all duration-200 hover:border-rose-400 hover:bg-rose-50 active:scale-95">
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center text-center p-6">
        <div className="relative mb-12">
          {/* Animated background orbs */}
          <div className="absolute inset-0 -m-8">
            <div className="w-40 h-40 bg-gradient-to-br from-indigo-200 to-purple-300 rounded-full animate-pulse opacity-30 blur-xl"></div>
          </div>
          <div className="absolute inset-0 -m-6">
            <div
              className="w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full animate-pulse opacity-40 blur-lg"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
          <div className="absolute inset-0 -m-4">
            <div
              className="w-24 h-24 bg-gradient-to-br from-pink-200 to-rose-300 rounded-full animate-pulse opacity-50 blur-md"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          {/* Main camera icon */}
          <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-indigo-100 to-purple-200 rounded-3xl flex items-center justify-center shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-3">
            <svg className="w-16 h-16 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-indigo-100">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            No Camera Reports Found
          </h3>
          <p className="text-gray-600 leading-relaxed mb-8">
            Your security system is running smoothly! No incidents have been detected by the camera monitoring system at
            this time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium transform transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh Reports
            </button>
            <button className="px-8 py-4 border-2 border-indigo-300 text-indigo-700 rounded-xl font-medium transform transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50 active:scale-95 flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go to Dashboard
            </button>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-3 h-3 bg-indigo-400 rounded-full animate-float opacity-60"
            style={{ animationDelay: "0s", animationDuration: "4s" }}
          ></div>
          <div
            className="absolute top-1/3 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-float opacity-40"
            style={{ animationDelay: "1s", animationDuration: "5s" }}
          ></div>
          <div
            className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-pink-400 rounded-full animate-float opacity-50"
            style={{ animationDelay: "2s", animationDuration: "6s" }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-rose-400 rounded-full animate-float opacity-30"
            style={{ animationDelay: "3s", animationDuration: "7s" }}
          ></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-emerald-100 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                Security Camera Reports ({data.length})
              </h2>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Latest security incidents and monitoring alerts
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-emerald-700">{totalCount}</div>
                  <div className="text-sm text-emerald-600">Total Reports</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-700">Live</div>
                  <div className="text-sm text-blue-600">Monitoring</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-700">Secure</div>
                  <div className="text-sm text-purple-600">Protected</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Reports List */}
        <div className="space-y-6">
          {data.map((item, index) => (
            <div
              key={item._id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-lg hover:shadow-xl transform transition-all duration-500 ease-out hover:scale-[1.02] overflow-hidden"
              style={{
                animationDelay: `${index * 150}ms`,
                animation: "slideInFromLeft 0.8s ease-out forwards",
              }}
            >
              <CameraReportItem report={item} />
            </div>
          ))}
        </div>

        {/* Enhanced Pagination */}
        <div className="flex justify-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100 p-6">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default CameraReportList
