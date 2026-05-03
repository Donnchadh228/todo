const ApiError = require('../expectations/apiError.js');
const GroupRepository = require('../repositories/groupRepository.js');

class GroupService {
  constructor(groupRepository) {
    this.groupRepository = groupRepository;
  }

  async createGroup(title, userId) {
    const group = await this.groupRepository.create(title, userId);

    return group;
  }

  async updateGroup(id, userId, newTitle) {
    const updatedGroup = await this.groupRepository.update(id, userId, newTitle);
    if (!updatedGroup) {
      throw ApiError.Forbidden('Такой группы нет или у вас нет к ней прав');
    }

    return updatedGroup;
  }

  async deleteGroup(id, userId) {
    const group = await this.groupRepository.delete(id, userId);

    return group;
  }

  async getAllGroups(options) {
    const { limit, page, userId, sortBy, sortOrder, offset } = options;
    const whereClause = { userId };
    const groups = await this.groupRepository.findAndCount({
      whereClause,
      limit,
      offset,
      sortBy,
      sortOrder,
    });

    return { ...groups, limit, currentPage: page };
  }

  async getGroup(id, userId) {
    const group = await this.groupRepository.findById(id, userId);
    if (!group) {
      throw ApiError.Forbidden('Такой группы не существует или у вас нет доступа к ней');
    }

    return group;
  }
}

const groupRepository = new GroupRepository();
module.exports = new GroupService(groupRepository);
