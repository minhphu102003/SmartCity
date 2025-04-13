"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, MapPin, ChevronDown, Camera } from "lucide-react"
import { CITIES } from "../../constants"

const CameraHeader = ({ selectedCity, setSelectedCity, searchTerm, setSearchTerm }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-gray-900 to-gray-800 p-5 rounded-xl shadow-lg border border-gray-700"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Camera className="h-6 w-6 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Camera Giám Sát</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input with Animation */}
          <motion.div whileHover={{ scale: 1.02 }} className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm camera..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-700/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-gray-700 transition-all duration-200 border border-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>

          {/* Custom Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full sm:w-48 px-4 py-2.5 rounded-lg bg-gray-700/70 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
            >
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                <span className="truncate">{selectedCity}</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                  isDropdownOpen ? "transform rotate-180" : ""
                }`}
              />
            </motion.button>

            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-full sm:w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
              >
                {CITIES.map((city) => (
                  <motion.button
                    key={city}
                    whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                    onClick={() => {
                      setSelectedCity(city)
                      setIsDropdownOpen(false)
                    }}
                    className={`flex items-center w-full px-4 py-2.5 text-left text-sm hover:bg-blue-500/10 transition-colors duration-150 ${
                      selectedCity === city ? "bg-blue-500/20 text-blue-400" : "text-white"
                    }`}
                  >
                    {selectedCity === city && <div className="w-1 h-4 bg-blue-500 rounded-full mr-2"></div>}
                    {city}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center"
      >
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400">Tổng Camera</span>
          <span className="text-lg font-semibold text-white">5</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400">Đang Hoạt Động</span>
          <span className="text-lg font-semibold text-green-400">4</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400">Bảo Trì</span>
          <span className="text-lg font-semibold text-amber-400">0</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400">Ngưng Hoạt Động</span>
          <span className="text-lg font-semibold text-red-400">1</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CameraHeader
