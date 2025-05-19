import { useState, useContext } from 'react';
import MethodContext from '../context/methodProvider';
import { updateAccountReportReview } from '../services/reviewReport';

export const useReviewHandler = (report) => {
    const { notify } = useContext(MethodContext);

  const [reviews, setReviews] = useState(() =>
    (report.reviews || []).filter((r) => r.status !== 'REJECTED')
  );

  const [isReviewed, setIsReviewed] = useState(() =>
    (report.reviews || []).some((r) => r.status === 'APPROVED')
  );

  const [rejectedReviews, setRejectedReviews] = useState(() =>
    (report.reviews || []).filter((r) => r.status === 'REJECTED')
  );


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
        setIsReviewed(true);
        notify('Review approved successfully!', 'success');
      } else if (action === 'REJECTED') {
        notify('Review rejected successfully!', 'success');
      }
    } catch (error) {
      console.error(error);
      notify('Failed to update review status.', 'error');
    }
  };

  return {
    reviews,
    rejectedReviews,
    isReviewed,
    handleReviewAction,
  };
};