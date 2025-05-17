import React, { useState } from 'react';
import CameraReportSkeleton from './CameraReportSkeleton';
import { useCameraReports } from '../../hooks/useCameraReports';
import { useReverseGeocode } from '../../hooks/useReverseGeocode';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn } from 'lucide-react';
import { FullImagePortal } from '../portal';

const CameraReportItem = ({ report }) => {
  const [imgError, setImgError] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const coordinates = report.camera_id?.location?.coordinates;
  const lat = coordinates?.[1];
  const lng = coordinates?.[0];

  const { address, loading: loadingAddress } = useReverseGeocode(lat, lng);

  if (imgError) return null;

  return (
    <>
      <li className="border p-4 mb-4 rounded shadow flex gap-4 relative group">
        <div className="relative w-32 h-24">
          <img
            src={report.img}
            alt="snapshot"
            className="w-full h-full object-cover rounded cursor-pointer transition-transform duration-200 group-hover:scale-105"
            onClick={() => setShowFullImage(true)}
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ZoomIn className="text-white w-6 h-6" />
          </div>
        </div>

        <div>
          <p><strong>Camera ID:</strong> {report.camera_id?._id}</p>
          <p><strong>Report Type:</strong> {report.typeReport}</p>
          <p><strong>Congestion Level:</strong> {report.congestionLevel}</p>
          <p><strong>Timestamp:</strong> {new Date(report.timestamp).toLocaleString()}</p>
          <p>
            <strong>Address:</strong>{' '}
            {loadingAddress ? (
              <span className="inline-block w-100 h-6 bg-gray-300 rounded animate-pulse"></span>
            ) : (
              address || 'Unknown'
            )}
          </p>
        </div>
      </li>

      <AnimatePresence>
        {showFullImage && (
          <FullImagePortal>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]"
              onClick={() => setShowFullImage(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.img
                src={report.img}
                alt="Full screen snapshot"
                className="max-w-[90%] max-h-[90%] rounded shadow-lg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          </FullImagePortal>
        )}
      </AnimatePresence>
    </>
  );
}

const CameraReportList = () => {
  const { data, loading } = useCameraReports();

  if (loading) {
    return (
      <ul>
        {Array.from({ length: 4 }).map((_, i) => (
          <CameraReportSkeleton key={i} />
        ))}
      </ul>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-center text-gray-600">
        <img
          src="https://www.123rf.com/photo_100130939_error-404-page-not-found-error-with-glitch-effect-on-screen-vector-illustration-for-your-design.html" // đảm bảo bạn có ảnh này trong thư mục public
          alt="No reports"
          className="w-40 h-40 mb-4 opacity-70"
        />
        <p className="text-lg font-medium">No camera reports available.</p>
      </div>
    );
  }

  return (
    <ul>
      {data.map((item) => (
        <CameraReportItem key={item._id} report={item} />
      ))}
    </ul>
  );
};

export default CameraReportList;
