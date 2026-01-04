const { Task, Group } = require("../models/indexModel.js");

const ApiError = require("../expectations/apiError.js");
const groupService = require("./groupService.js");

class TaskService {
  async createTask(name, userId, groupId) {
    const task = await Task.create({ name, userId, groupId });
    return task;
  }

  async changeTask(taskId, updates, userId) {
    // Если переносим задачу в другую группу
    if (updates.groupId) {
      const group = await groupService.getOneGroup(updates.groupId, userId);

      if (!group) {
        throw ApiError.Forbidden();
      }
    }

    const task = await Task.findOne({ where: { id: taskId, userId } });
    if (!task) {
      throw ApiError.BadRequest("Данная задача отсутствует, невозможно провести изменения");
    }

    await task.update({ ...updates });

    return task;
  }

  async getAllTasks(limit, offset, userId) {
    const tasks = await Task.findAndCountAll({
      where: { userId },
      limit,
      offset,
      include: [{ model: Group, attributes: ["name"] }],
      order: [["id", "DESC"]],
    });
    tasks.limit = limit;

    return tasks;
  }

  async removeTask(taskId, userId) {
    const task = await Task.destroy({ where: { id: taskId, userId } });
    if (!task) {
      throw ApiError.BadRequest("Данной задачи нет или у вас нет доступа к ней");
    }
    return task;
  }

  async getOneTask(taskId, userId) {
    const task = await Task.findOne({ where: { id: taskId, userId } });
    if (!group) {
      throw ApiError.BadRequest("Такой задачи не существует или у вас нет доступа к ней");
    }

    return task;
  }
}

module.exports = new TaskService();
