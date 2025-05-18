import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PendingReviewList from './PendingReviewList';

const PendingReviewToggle = ({ reviews = [], handleReviewAction }) => {
  const [showReviews, setShowReviews] = useState(false);
  const pendingReviews = reviews.filter((r) => r.status === 'PENDING');

  if (pendingReviews.length === 0) return null;

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowReviews(!showReviews)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-blue-800 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition"
      >
        <span>
          {pendingReviews.length} pending review(s) – {showReviews ? 'Hide' : 'Show'} details
        </span>
        <motion.span
          initial={false}
          animate={{ rotate: showReviews ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-4 h-4 ml-2 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence>
        {showReviews && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PendingReviewList
              reviews={reviews}
              handleReviewAction={handleReviewAction}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PendingReviewToggle;
