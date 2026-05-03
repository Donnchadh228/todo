const { Group, Task } = require('../models/indexModel.js');

class GroupRepository {
  async create(name, userId) {
    return Group.create({ name, userId });
  }

  async findById(id, userId) {
    return Group.findOne({ where: { id, userId } });
  }

  async update(id, userId, newName) {
    const [affectedCount, affectedRows] = await Group.update(
      { name: newName },
      { where: { id, userId }, returning: true }
    );

    if (affectedCount === 0) {
      return null;
    }

    return affectedRows[0];
  }

  async delete(id, userId) {
    const deleted = await Group.destroy({ where: { id, userId } });
    return deleted > 0;
  }

  async findAndCount({ whereClause, limit, offset, sortBy, sortOrder }) {
    return Group.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [{ model: Task, attributes: ['name'] }],
      order: [[sortBy, sortOrder]],
      distinct: true,
    });
  }
}

module.exports = GroupRepository;
