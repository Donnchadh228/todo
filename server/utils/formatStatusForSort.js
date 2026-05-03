module.exports = function formatStatusForSort(status) {
  switch (status) {
    case 'All':
      return undefined;
    case '0':
      return false;
    case '1':
      return true;
    default:
      return undefined;
  }
};
