const { Task, Group } = require("../models/indexModel.js");
const TaskDto = require("../dtos/taskDto");
const ApiError = require("../expectations/apiError.js");
const groupService = require("./groupService.js");
class TaskService {
  async createTask(name, userId, groupId) {
    const task = await Task.create({ name, userId, groupId });
    return task;
  }
  async changeTask(taskId, updates, userId) {
    const group = await groupService.getOneGroup(updates.groupId);

    if (group.userId !== userId) {
      throw ApiError.Forbidden();
    }

    const task = await Task.findByPk(taskId);
    const newTask = new TaskDto(updates);

    await task.update({ ...newTask });

    return task;
  }
  async getAllTasks(limit, offset, userId) {
    const tasks = await Task.findAndCountAll({ where: { userId }, limit, offset });
    return tasks;
  }
  async removeTask(taskId) {
    const task = await Task.destroy({ where: { id: taskId } });
    return task;
  }
  async getOne(id) {
    const task = await Task.findByPk(id);
    if (!task) {
      throw ApiError.BadRequest("Данной задачи не существует");
    }
    return task;
  }
}

module.exports = new TaskService();
