const ApiError = require("../expectations/apiError.js");
const { Group, User, Task } = require("../models/indexModel.js");

class GroupService {
  async createGroup(name, userId) {
    const group = await Group.create({ name, userId });

    return group;
  }

  async changeGroup(id, name, userId) {
    const group = await Group.findOne({ where: { id, userId } });
    if (!group) {
      throw ApiError.BadRequest("Такой группы нет или у вас нет к ней прав");
    }
    group.name = name;
    await group.save();

    return group;
  }

  async removeGroup(id, userId) {
    const group = await Group.destroy({ where: { id, userId } });

    return group;
  }

  async getAllGroup(options) {
    const { limit, page, userId, sortBy, sortOrder, offset } = options;

    const groups = await Group.findAndCountAll({
      include: [
        {
          model: Task,
          separate: true,
          order: [["id", "DESC"]],
        },
      ],
      where: { userId },
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    groups.limit = limit;
    groups.currentPage = page;

    return groups;
  }

  async getOneGroup(id, userId) {
    const group = await Group.findOne({ where: { id, userId } });
    if (!group) {
      throw ApiError.BadRequest("Такой группы не существует или у вас нет доступа к ней");
    }

    return group;
  }
}

module.exports = new GroupService();
