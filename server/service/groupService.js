const ApiError = require('../exceptions/apiError.js');
const GroupRepository = require('../repositories/groupRepository.js');

class GroupService {
  constructor(groupRepository) {
    this.groupRepository = groupRepository;
  }

  async createGroup(name, userId) {
    return this.groupRepository.create(name, userId);
  }

  async updateGroup(id, userId, newName) {
    const updatedGroup = await this.groupRepository.update(id, userId, newName);

    if (!updatedGroup) {
      throw ApiError.NotFound();
    }

    return updatedGroup;
  }

  async deleteGroup(id, userId) {
    const isDeleted = await this.groupRepository.delete(id, userId);
    if (!isDeleted) {
      throw ApiError.NotFound();
    }

    return isDeleted;
  }

  async findGroupsByOptions(options) {
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

  async getGroupById(id, userId) {
    const group = await this.groupRepository.findById(id, userId);
    if (!group) {
      throw ApiError.NotFound();
    }

    return group;
  }
}

module.exports = GroupService;
