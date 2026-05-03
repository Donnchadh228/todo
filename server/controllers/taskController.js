const taskService = require('../service/taskService');

class TaskController {
  async createTask(req, res, next) {
    try {
      const { name, groupId } = req.body;
      const userId = req.user.id;

      const task = await taskService.createTask(name, userId, groupId);

      return res.json(task);
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const userId = req.user.id;

      const updatedTask = await taskService.updateTask(id, updates, userId);

      return res.json(updatedTask);
    } catch (error) {
      next(error);
    }
  }

  async getAllTasks(req, res, next) {
    try {
      let { sortBy = 'createdAt', sortOrder = 'desc', limit, page, status } = req.query;
      const userId = req.user.id;
      page = parseInt(page, 10) || 1;
      limit = parseInt(limit, 10) || 9;

      let offset = (page - 1) * limit;

      const options = {
        limit,
        offset,
        userId,
        sortBy,
        sortOrder,
        status: status ? parseInt(status, 10) : undefined,
      };

      const tasks = await taskService.getAllTasks(options);

      return res.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const deletedTask = await taskService.deleteTask(id, userId);

      return res.json(deletedTask);
    } catch (error) {
      next(error);
    }
  }

  async getTask(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const task = await taskService.getTask(id, userId);

      return res.json(task);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
