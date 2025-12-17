const Task = require("../models/TaskModel");
const TaskDto = require("../dtos/taskDto");
class TaskService {
  async createTask(name, userId, groupId) {
    const task = await Task.create({ name, userId, groupId });
    return task;
  }
  async changeTask(taskId, updates) {
    const task = await Task.findByPk(taskId);
    const newTask = new TaskDto(updates);

    await task.update(newTask);
    return task;
  }
  async getAllTasks(limit, offset) {
    const tasks = await Task.findAndCountAll({ limit, offset });
    return tasks;
  }
  async removeTask(taskId) {
    const task = await Task.destroy({ where: { id: taskId } });
    return task;
  }
}

module.exports = new TaskService();
