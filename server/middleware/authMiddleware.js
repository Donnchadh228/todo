const ApiError = require('../exceptions/apiError.js');

module.exports = function (tokenService) {
  return function (req, res, next) {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return next(ApiError.Unauthorized());
      }
      const accessToken = authorizationHeader.split(' ')[1];
      if (!accessToken) {
        return next(ApiError.Unauthorized());
      }
      const userData = tokenService.validateAccessToken(accessToken);
      if (!userData) {
        return next(ApiError.Unauthorized());
      }

      req.user = userData;
      next();
    } catch (error) {
      console.error(error);
      return next(ApiError.Unauthorized());
    }
  };
};
