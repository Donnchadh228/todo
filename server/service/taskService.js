const ApiError = require('../expectations/apiError.js');
const groupService = require('./groupService.js');
const TaskRepository = require('../repositories/taskRepository.js');
const GroupRepository = require('../repositories/groupRepository.js');

class TaskService {
  constructor(taskRepository, groupRepository) {
    this.taskRepository = taskRepository;
    this.groupRepository = groupRepository;
  }
  async createTask(name, userId, groupId) {
    const task = await this.taskRepository.create(name, userId, groupId);

    return task;
  }

  async updateTask(taskId, updates, userId) {
    try {
      const newGroupId = updates.groupId;

      // Если нужно перенести задачу в другую группу
      if (newGroupId) {
        const group = await this.groupRepository.findById(newGroupId, userId);
        if (!group) {
          throw ApiError.NotFound('Группа не найдена');
        }

        if (!group || group.userId !== userId) {
          throw ApiError.Forbidden();
        }
      }

      const task = await this.taskRepository.update(taskId, userId, updates);
      if (!task) {
        throw ApiError.NotFound('Задача не найдена или у вас отсутствует доступ');
      }

      return task;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllTasks(options) {
    const { offset, userId, limit, sortBy, sortOrder, status } = options;

    let whereClause = { userId };
    if (status !== undefined) {
      whereClause.status = status;
    }

    const result = await this.taskRepository.findAndCount({
      whereClause,
      limit,
      offset,
      sortBy,
      sortOrder,
    });

    return { ...result, limit };
  }

  async deleteTask(taskId, userId) {
    const task = await this.taskRepository.delete(taskId, userId);

    if (!task) {
      throw ApiError.BadRequest('Данной задачи нет или у вас нет доступа к ней');
    }
    console.log(task);
    return task;
  }

  async getTask(taskId, userId) {
    const task = await this.taskRepository.findById(taskId, userId);

    if (!task) {
      throw ApiError.BadRequest('Такой задачи не существует или у вас нет доступа к ней');
    }

    return task;
  }
}
const taskRepository = new TaskRepository();
const groupRepository = new GroupRepository();
module.exports = new TaskService(taskRepository, groupRepository);
