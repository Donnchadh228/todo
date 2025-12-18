const Router = require("express");
const router = new Router();

const taskController = require("../controllers/taskController");
const taskPermissionMiddleware = require("../middleware/taskPermissionMiddleware");
const { taskValidation } = require("../validation/taskValidation");

// create - delete - change - readAll - read
router.post("/", taskValidation, taskController.createTask);
router.delete("/:id", taskPermissionMiddleware, taskController.deleteTask);
router.put("/:id", taskValidation, taskPermissionMiddleware, taskController.changeStatus);
router.get("/", taskController.getAll);

module.exports = router;
