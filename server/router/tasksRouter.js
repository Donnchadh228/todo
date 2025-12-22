const Router = require("express");
const router = new Router();

const taskController = require("../controllers/taskController");
const { taskValidation } = require("../validation/taskValidation");
const checkOwnership = require("../middleware/checkOwnershipMiddleware.js");
const { Task } = require("../models/indexModel.js");

const checkTaskOwnership = checkOwnership({
  model: Task,
  idParam: "id",
  ownershipField: "userId",
  reqKey: "project",
  errorMessage: "Вы не являетесь владельцем задания",
  notFoundMessage: "Задание не найдено",
});

// create - delete - change - readAll - read
router.post("/", taskValidation, taskController.createTask);
router.delete("/:id", checkTaskOwnership, taskController.deleteTask);
router.put("/:id", taskValidation, checkTaskOwnership, taskController.changeTask);
router.get("/", taskController.getAll);
router.get("/:id", checkTaskOwnership, taskController.getOne);

module.exports = router;
