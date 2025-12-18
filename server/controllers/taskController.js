const taskService = require("../service/taskService");

class TaskController {
  async createTask(req, res, next) {
    try {
      const { name, groupId } = req.body;
      const userId = req.user.id;

      const task = await taskService.createTask(name, userId, groupId);
      res.json(task);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async changeStatus(req, res, next) {
    try {
      const { id } = req.params;
      const changedParams = req.body;

      const task = await taskService.changeTask(id, changedParams);

      res.json(task);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      let { limit, page } = req.query;
      const { id: userId } = req.user;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 9;
      let offset = page * limit - limit;
      const tasks = await taskService.getAllTasks(limit, offset, userId);
      res.json(tasks);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      const task = await taskService.removeTask(id);
      res.json(task);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = new TaskController();
