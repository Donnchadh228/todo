const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/apiError');

module.exports = (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Validation failed', errors.array()));
    }
  } catch (error) {
    console.log(error);
  }
  next();
};
