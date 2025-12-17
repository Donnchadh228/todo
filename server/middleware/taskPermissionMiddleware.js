const ApiError = require("../expectations/apiError.js");
const Task = require("../models/TaskModel.js");

module.exports = async (req, res, next) => {
  try {
    const taskId = req.params.id || req.body.id;
    const userId = req.user.id;
    const task = await Task.findByPk(taskId);

    if (!task) {
      return next(ApiError.BadRequest("Задача не найдена"));
    }
    if (task.userId !== userId) {
      return next(ApiError.BadRequest("У вас нет прав на эту задачу"));
    }

    req.task = task;
    next();
  } catch (error) {
    console.error("Ошибка в middleware проверки прав:", error);
    return next(ApiError.BadRequest("Ошибка"));
  }
};
