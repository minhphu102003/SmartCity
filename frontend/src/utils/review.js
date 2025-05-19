export const getReviewStats = (reports) => {
  let approved = 0;
  let rejected = 0;
  let pending = 0;
  let unreviewed = 0;

  reports.forEach((report) => {
    const reviews = report.reviews || [];

    if (reviews.length === 0) {
      unreviewed += 1;
    } else if (reviews.some((r) => r.status === 'APPROVED')) {
      approved += 1;
    } else if (reviews.every((r) => r.status === 'REJECTED')) {
      rejected += 1;
    } else {
      pending += 1;
    }
  });

  return [
    { name: 'Approved', value: approved },
    { name: 'Rejected', value: rejected },
    { name: 'Pending', value: pending },
    { name: 'Unreviewed', value: unreviewed },
  ];
};