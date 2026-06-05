const { body } = require('express-validator');
const { validationMiddleware } = require('../di.js');

const taskValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Task name must not be empty')
    .bail()
    .isLength({ min: 2, max: 25 })
    .withMessage('Task name must be between 2 and 25 characters'),
];

exports.taskValidation = [...taskValidation, validationMiddleware];
