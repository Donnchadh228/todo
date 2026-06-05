const formatStatusForFilter = require('../utils/formatStatusForFilter.js');
const formatStatusForSort = require('../utils/formatStatusForSort.js');
const autoBind = require('auto-bind').default;
class TaskController {
  constructor(taskService) {
    this.taskService = taskService;
    autoBind(this);
  }
  async createTask(req, res, next) {
    try {
      const { name, groupId } = req.body;
      const userId = req.user.id;

      const task = await this.taskService.createTask(name, userId, groupId);

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

      const updatedTask = await this.taskService.updateTask(id, updates, userId);

      return res.json(updatedTask);
    } catch (error) {
      next(error);
    }
  }

  async queryTasks(req, res, next) {
    try {
      let { sortBy, sortOrder, limit, page, status } = req.query;
      const userId = req.user.id;

      page = parseInt(page, 10) || 1;
      limit = parseInt(limit, 10) || 9;

      let offset = (page - 1) * limit;

      const sort = formatStatusForSort(sortBy, sortOrder);

      const options = {
        limit,
        offset,
        userId,
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder,
        status: formatStatusForFilter(status),
      };

      const tasksWithOptions = await this.taskService.findTasksByOptions(options);

      return res.json(tasksWithOptions);
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const isDeleted = await this.taskService.deleteTask(id, userId);

      return res.json({ deleted: isDeleted });
    } catch (error) {
      next(error);
    }
  }

  async getTask(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const task = await this.taskService.getTaskById(id, userId);

      return res.json(task);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TaskController;
