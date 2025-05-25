"use client"
import { useState } from "react"
import PlaceRow from "../../components/row/PlaceRow"
import NewPlaceRow from "../../components/row/NewPlaceRow"
import usePlaces from "../../hooks/usePlaces"

const AdminPlacesTable = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { places, setPlaces, loading, error, totalPages } = usePlaces(currentPage)

  const [newPlace, setNewPlace] = useState({
    name: "",
    type: "Restaurant",
    img: "",
    star: 0,
    status: true,
    timeOpen: "",
    timeClose: "",
  })

  const handleChange = (id, field, value) => {
    setPlaces((prev) => prev.map((place) => (place.id === id ? { ...place, [field]: value } : place)))
  }

  const handleSave = (id) => {
    const updatedPlace = places.find((p) => p.id === id)
    console.log("Save this place to backend:", updatedPlace)
  }

  const handleCreate = () => {
    console.log("Creating new place:", newPlace)
    setNewPlace({
      name: "",
      type: "Restaurant",
      img: "",
      star: 0,
      status: true,
      timeOpen: "",
      timeClose: "",
    })
  }

  const renderSkeletonRows = (count = 12) => {
    return Array.from({ length: count }).map((_, index) => (
      <tr
        key={index}
        className="animate-pulse hover:bg-gray-50 transition-colors duration-200"
        style={{
          animationDelay: `${index * 100}ms`,
          animation: "fadeInUp 0.6s ease-out forwards",
        }}
      >
        {Array.from({ length: 9 }).map((__, i) => (
          <td key={i} className="border-b border-gray-100 p-4">
            <div className="h-6 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded-lg" />
          </td>
        ))}
      </tr>
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Places Management
              </h1>
              <p className="text-gray-600 mt-1">Manage restaurants, cafes, and other venues</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700">{loading ? "..." : places.length}</div>
                  <div className="text-sm text-blue-600">Total Places</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200 transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-700">
                    {loading ? "..." : places.filter((p) => p.status).length}
                  </div>
                  <div className="text-sm text-green-600">Active Places</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200 transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700">{totalPages || "..."}</div>
                  <div className="text-sm text-purple-600">Total Pages</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Error State */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 shadow-lg animate-shake">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-red-800">Error Loading Places</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Table Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Places Directory</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Data</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  {[
                    { label: "Image", icon: "📷" },
                    { label: "Name", icon: "🏪" },
                    { label: "Type", icon: "🏷️" },
                    { label: "Address", icon: "📍" },
                    { label: "Rating", icon: "⭐" },
                    { label: "Status", icon: "🔄" },
                    { label: "Open", icon: "🕐" },
                    { label: "Close", icon: "🕕" },
                    { label: "Actions", icon: "⚙️" },
                  ].map((header, index) => (
                    <th
                      key={header.label}
                      className="border-b border-blue-200 p-4 text-left font-semibold text-gray-700 transform transition-all duration-300 hover:bg-blue-100"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: "slideInFromTop 0.5s ease-out forwards",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{header.icon}</span>
                        <span>{header.label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading
                  ? renderSkeletonRows(6)
                  : places.map((place, index) => (
                      <PlaceRow
                        key={place.id}
                        place={place}
                        onChange={handleChange}
                        onSave={handleSave}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: "slideInFromLeft 0.6s ease-out forwards",
                        }}
                      />
                    ))}

                {!loading && (
                  <NewPlaceRow
                    newPlace={newPlace}
                    setNewPlace={setNewPlace}
                    onCreate={handleCreate}
                    style={{
                      animationDelay: `${places.length * 100}ms`,
                      animation: "slideInFromLeft 0.6s ease-out forwards",
                    }}
                  />
                )}
              </tbody>
            </table>
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
                  <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <span className="text-gray-600 font-medium">Loading places...</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Pagination */}
        {!loading && places.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Showing page</span>
                <span className="font-semibold text-blue-600">{currentPage}</span>
                <span>of</span>
                <span className="font-semibold text-blue-600">{totalPages}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg font-medium transform transition-all duration-200 hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    const isActive = pageNum === currentPage
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transform transition-all duration-200 hover:scale-110 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium transform transition-all duration-200 hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-2px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(2px);
          }
        }

        .animate-shimmer {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default AdminPlacesTable
