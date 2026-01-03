const Router = require("express");
const router = new Router();

const taskRouter = require("./tasksRouter");
const groupRouter = require("./groupsRouter");
const userRouter = require("./usersRouter");
const authMiddleware = require("../middleware/authMiddleware");

router.use("/task", authMiddleware, taskRouter);
router.use("/group", authMiddleware, groupRouter);
router.use("/user", userRouter);

module.exports = router;
