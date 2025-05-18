import React from 'react';

const PendingReviewList = ({ reviews = [], handleReviewAction }) => {
  const pendingReviews = reviews.filter((r) => r.status === 'PENDING');

  if (pendingReviews.length === 0) return null;

  return (
    <ul className="space-y-2 mt-2">
      {pendingReviews.map((review) => (
        <li
          key={review.id}
          className="p-3 bg-gray-50 border rounded shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Reason:</span> {review.reason}
            </p>
            <p className="text-xs text-gray-500">
              Reviewed At: {new Date(review.reviewedAt).toLocaleString()}
            </p>
          </div>

          <div className="mt-2 sm:mt-0 sm:ml-4 flex gap-2">
            <button
              onClick={() => handleReviewAction(review.id, 'APPROVED')}
              className="px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => handleReviewAction(review.id, 'REJECTED')}
              className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded"
            >
              Reject
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PendingReviewList;
