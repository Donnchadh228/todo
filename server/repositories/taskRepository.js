const { Task, Group } = require('../models/indexModel.js');

class TaskRepository {
  async create(name, userId, groupId) {
    return Task.create({ name, userId, groupId });
  }

  async findById(id, userId) {
    return Task.findOne({ where: { id, userId } });
  }

  async findAndCount({ whereClause, limit, offset, sortBy, sortOrder }) {
    return Task.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [{ model: Group, attributes: ['name'] }],
      order: [[sortBy, sortOrder]],
      distinct: true,
    });
  }

  async update(taskId, userId, data) {
    const [affectedCount, affectedRows] = await Task.update(data, {
      where: { id: taskId, userId },
      returning: true,
    });

    if (affectedCount === 0) {
      return null;
    }

    return affectedRows[0];
  }

  async delete(taskId, userId) {
    const deleted = await Task.destroy({ where: { id: taskId, userId } });
    return deleted > 0;
  }
}
module.exports = TaskRepository;
