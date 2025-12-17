const { body } = require("express-validator");
const validationMiddleware = require("../middleware/validationMiddleware");

authValidation = [
  body("login")
    .trim()
    .isLength({ min: 3, max: 8 })
    .withMessage("Логин должен быть 3-8 символов")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Только латинские буквы, цифры и _"),

  body("password")
    .notEmpty()
    .withMessage("Пароль обязателен")
    .isLength({ min: 3, max: 12 })
    .withMessage("Пароль должен быть 3-12 символов"),
];

exports.authValidation = [...authValidation, validationMiddleware];
