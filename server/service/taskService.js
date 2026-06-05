const ApiError = require('../exceptions/apiError.js');

class TaskService {
  constructor(taskRepository, groupService) {
    this.taskRepository = taskRepository;
    this.groupService = groupService;
  }

  async createTask(name, userId, groupId) {
    return this.taskRepository.create(name, userId, groupId);
  }

  async updateTask(taskId, updates, userId) {
    const newGroupId = updates.groupId;

    // if need to change group, check if the new group exists and belongs to the user
    if (newGroupId) {
      const group = await this.groupService.getGroupById(newGroupId, userId);

      if (!group) {
        throw ApiError.NotFound();
      }
    }

    const task = await this.taskRepository.update(taskId, userId, updates);
    if (!task) {
      throw ApiError.NotFound();
    }

    return task;
  }

  async findTasksByOptions(options) {
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
      throw ApiError.NotFound();
    }

    return task;
  }

  async getTaskById(taskId, userId) {
    const task = await this.taskRepository.findById(taskId, userId);

    if (!task) {
      throw ApiError.NotFound();
    }

    return task;
  }
}

module.exports = TaskService;
