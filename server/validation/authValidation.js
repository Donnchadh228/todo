const { body } = require('express-validator');
const { validationMiddleware } = require('../di.js');

const authValidation = [
  body('login')
    .trim()
    .notEmpty()
    .withMessage('Login must not be empty')
    .bail()
    .isLength({ min: 3, max: 8 })
    .withMessage('Login must be between 3 and 8 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Only Latin letters, numbers and _'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 3, max: 12 })
    .withMessage('Password must be between 3 and 12 characters'),
];

exports.authValidation = [...authValidation, validationMiddleware];
