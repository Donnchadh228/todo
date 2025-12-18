const { validationResult } = require("express-validator");
const ApiError = require("../expectations/apiError");

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(ApiError.BadRequest("Ошибка при валидации", errors.array()));
  }
  next();
};
