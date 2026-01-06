const taskService = require("../service/taskService");

class TaskController {
  async createTask(req, res, next) {
    try {
      const { name, groupId } = req.body;
      const userId = req.user.id;

      const task = await taskService.createTask(name, userId, groupId);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  async changeTask(req, res, next) {
    try {
      const { id } = req.params;
      const changedParams = req.body;

      const task = await taskService.changeTask(id, changedParams, req.user.id);

      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  async getAllTasks(req, res, next) {
    try {
      let { sortBy = "createdAt", sortOrder = "desc", limit, page, status } = req.query;
      const userId = req.user.id;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 9;

      let offset = page * limit - limit;

      const options = { limit, offset, userId, sortBy, sortOrder, status: status ? parseInt(status) : undefined };

      const tasks = await taskService.getAllTasks(options);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const task = await taskService.removeTask(id, userId);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }
  async getOneTask(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const task = await taskService.getOneTask(id, userId);

      res.json(task);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
