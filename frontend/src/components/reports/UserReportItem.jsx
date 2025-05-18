import React, { useState } from 'react';
import { useReverseGeocode } from '../../hooks/useReverseGeocode';
import { TrafficCone, Droplet } from 'lucide-react';
import { timeAgo } from '../../utils/timeUtils';
import { FiClock } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import AnalysisStatusBadge from './AnalysisStatusBadge';
import { ReportImagePreview } from '../img';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { PendingReviewToggle } from '../reviews';
import MethodContext from '../../context/methodProvider';
import { useContext } from 'react';
import { updateAccountReportReview } from '../../services/reviewReport';

const UserReportItem = ({ report }) => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [reviews, setReviews] = useState(() => {
    return (report.reviews || []).filter(r => r.status !== 'REJECTED');
  });

  const [rejectedReviews, setRejectedReviews] = useState(() => {
    return (report.reviews || []).filter(r => r.status === 'REJECTED');
  });
  const { notify } = useContext(MethodContext);

  const lat = report.latitude;
  const lng = report.longitude;
  const { address, loading: loadingAddress } = useReverseGeocode(lat, lng);

  const renderIcon = () => {
    switch (report.typeReport) {
      case 'TRAFFIC_JAM':
        return <TrafficCone className="w-6 h-6 text-yellow-600 mr-2" />;
      case 'FLOOD':
        return <Droplet className="w-6 h-6 text-blue-600 mr-2" />;
      default:
        return null;
    }
  };

  const handleReviewAction = async (reviewId, action) => {
    try {
      await updateAccountReportReview(reviewId, { status: action });

      setReviews((prevReviews) => {
        const rejectedReview = prevReviews.find((r) => r.id === reviewId);

        if (action === 'REJECTED' && rejectedReview) {
          setRejectedReviews((prev) => [...prev, { ...rejectedReview, status: 'REJECTED' }]);
        }

        return prevReviews.filter((r) => r.id !== reviewId);
      });

      if (action === 'APPROVED') {
        notify('Review approved successfully!', 'success');
      } else if (action === 'REJECTED') {
        notify('Review rejected successfully!', 'success');
      }
    } catch (error) {
      console.error(error);
      notify('Failed to update review status.', 'error');
    }
  };

  return (
    <li className="border p-4 mb-4 rounded shadow bg-white">
      <div className="flex items-center mb-3 text-lg font-semibold text-gray-800">
        {renderIcon()}
        <span>
          {report.typeReport === 'TRAFFIC_JAM'
            ? 'Traffic Jam'
            : report.typeReport === 'FLOOD'
              ? 'Flood'
              : report.typeReport}
        </span>
      </div>

      <div className="mb-3">
        <p className="flex items-center gap-2 text-lg font-medium text-gray-800">
          <FaUser className="text-blue-500" />
          <strong>Username:</strong> {report.username}
        </p>
        <p className="flex items-center gap-1 text-gray-600 italic">
          <FiClock />
          {timeAgo(report.timestamp)}
        </p>
        <p><strong>Description:</strong> {report.description || 'N/A'}</p>
      </div>

      <ReportImagePreview
        imgs={report.imgs}
        analysisStatus={report.analysisStatus}
        setSelectedImg={setSelectedImg}
      />

      <AnimatePresence>
        {selectedImg && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >

            <motion.button
              onClick={() => setSelectedImg(null)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              title="Close"
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.img
              key="enlarged-image"
              src={selectedImg}
              alt="Full screen"
              className="max-w-full max-h-full object-contain cursor-zoom-out"
              onClick={() => setSelectedImg(null)}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-3 text-sm text-gray-700 font-medium">Reporter Role(s):</p>
      <div className="mt-1 flex gap-2">
        {report.roles?.map((role) => (
          <span
            key={role}
            className={`px-2 py-0.5 rounded-full text-xs font-semibold 
        ${role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
        ))}
      </div>

      <p className="mt-2 text-sm text-gray-700">
        <span className="font-medium">Address:</span>{' '}
        {loadingAddress ? (
          <span className="inline-block w-40 h-5 bg-gray-300 rounded animate-pulse"></span>
        ) : (
          address || 'Unknown'
        )}
      </p>

      <p className="mt-1 text-sm text-gray-700">
        <span className="font-medium">Analysis Status:</span>{' '}
        <AnalysisStatusBadge status={report.analysisStatus} />
      </p>

      <PendingReviewToggle
        reviews={reviews}
        handleReviewAction={handleReviewAction}
      />

      {rejectedReviews.length > 0 && (
        <div className="mt-6 p-4 border rounded bg-red-50">
          <h4 className="font-semibold text-red-700 mb-2">Rejected Reviews</h4>
          <ul className="space-y-2">
            {rejectedReviews.map((review) => (
              <li key={review.id} className="p-2 border rounded bg-white">
                <p><strong>Reason:</strong> {review.reason || 'No reason provided'}</p>
                <p><strong>Status:</strong> {review.status}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

    </li>
  );
};

export default UserReportItem;
