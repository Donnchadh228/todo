const ApiError = require("../expectations/apiError.js");

module.exports = function checkOwnershipMiddleware({
  model,
  idParam = "id",
  ownershipField = "userId",
  errorMessage = "У вас недостаточно прав для данного контента",
  notFoundMessage = "Ресурс не найден",
  reqKey = "resource",
} = {}) {
  if (!model) {
    throw new Error("checkOwnershipMiddleware: параметр 'model' обязателен");
  }

  return async (req, res, next) => {
    try {
      const resourceId = req.params[idParam];

      if (!resourceId) {
        return next(ApiError.BadRequest(`ID ресурса не указан в параметре :${idParam}`));
      }

      const resource = await model.findByPk(resourceId);

      if (!resource) {
        return next(ApiError.BadRequest(notFoundMessage));
      }

      if (resource[ownershipField] !== req.user.id) {
        return next(ApiError.Forbidden(errorMessage));
      }

      req[reqKey] = resource;

      next();
    } catch (error) {
      next(error);
    }
  };
};
