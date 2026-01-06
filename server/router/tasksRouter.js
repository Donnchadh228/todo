const Router = require("express");
const router = new Router();

const taskController = require("../controllers/taskController");
const { taskValidation } = require("../validation/taskValidation");

const { Task } = require("../models/indexModel.js");

// create - readAll - read - change - delete
router.post("/", taskValidation, taskController.createTask);

router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getOneTask);

router.put("/:id", taskValidation, taskController.changeTask);

router.delete("/:id", taskController.deleteTask);

module.exports = router;
