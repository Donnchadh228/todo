const { validationResult } = require('express-validator');
const ApiError = require('../expectations/apiError');

module.exports = (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
    }
  } catch (error) {
    console.log(error);
  }
  next();
};
