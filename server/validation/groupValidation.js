const { body } = require('express-validator');
const { validationMiddleware } = require('../di.js');

const groupValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Group name must not be empty')
    .bail()
    .isLength({ min: 2, max: 15 })
    .withMessage('Group name must be between 2 and 15 characters'),
];

exports.groupValidation = [...groupValidation, validationMiddleware];
