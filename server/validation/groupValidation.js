const { body } = require("express-validator");
const validationMiddleware = require("../middleware/validationMiddleware");

groupValidation = [
  body("name").trim().isLength({ min: 2, max: 15 }).withMessage("Название группы должно быть от 2 до 15 символов"),
];

exports.groupValidation = [...groupValidation, validationMiddleware];
