module.exports = function formatStatusForSort(sortBy, sortOrder) {
  const allowedSortFields = ['createdAt'];
  const allowedSortOrders = ['ASC', 'DESC', 'asc', 'desc'];

  let safeSortBy = 'createdAt';
  if (sortBy && allowedSortFields.includes(sortBy)) {
    safeSortBy = sortBy;
  }

  let safeSortOrder = 'DESC';
  if (sortOrder && allowedSortOrders.includes(sortOrder)) {
    safeSortOrder = sortOrder.toUpperCase();
  }
  return {
    sortBy: safeSortBy,
    sortOrder: safeSortOrder,
  };
};
