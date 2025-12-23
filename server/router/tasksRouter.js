const Router = require("express");
const router = new Router();

const taskController = require("../controllers/taskController");
const { taskValidation } = require("../validation/taskValidation");

const { Task } = require("../models/indexModel.js");

// create - delete - change - readAll - read
router.post("/", taskValidation, taskController.createTask);
router.delete("/:id", taskController.deleteTask);
router.put("/:id", taskValidation, taskController.changeTask);
router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getOneTask);

module.exports = router;
