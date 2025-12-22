const { body } = require("express-validator");
const validationMiddleware = require("../middleware/validationMiddleware");

taskValidation = [
  body("name").trim().isLength({ min: 2, max: 25 }).withMessage("Название задачи должно быть от 2 до 25 символов"),
];

exports.taskValidation = [...taskValidation, validationMiddleware];
