export const getPaginationData = ({ page = 1, limit = 10 }) => {
  const currentPage = parseInt(page, 10);
  const perPage = parseInt(limit, 10);
  const skip = (currentPage - 1) * perPage;
  return { skip, limit: perPage, currentPage };
};
