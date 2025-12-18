const Group = require("../models/GroupModel");

class GroupService {
  async createGroup(name, userId) {
    const group = await Group.create({ name, userId });

    return group;
  }
  async changeGroup(id, name) {
    const group = await Group.findByPk(id);
    group.name = name;
    await group.save();
    return group;
  }
  async removeGroup(id) {
    const group = await Group.destroy({ where: { id } });
    return group;
  }
  async getAllGroup(limit, offset, userId) {
    const groups = await Group.findAndCountAll({ where: { userId }, limit, offset });
    return groups;
  }
}

module.exports = new GroupService();
