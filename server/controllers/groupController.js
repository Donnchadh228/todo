const { groupService } = require('../di.js');
const formatStatusForSort = require('../utils/formatStatusForSort.js');
const autoBind = require('auto-bind').default;

class GroupController {
  constructor(groupService) {
    this.groupService = groupService;
    autoBind(this);
  }
  async createGroup(req, res, next) {
    try {
      const { name } = req.body;
      const userId = req.user.id;

      const group = await this.groupService.createGroup(name, userId);

      return res.json(group);
    } catch (error) {
      next(error);
    }
  }
  async deleteGroup(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const isDeleted = await this.groupService.deleteGroup(id, userId);

      return res.json(isDeleted);
    } catch (error) {
      next(error);
    }
  }
  async queryGroups(req, res, next) {
    try {
      let { limit, page, sortBy, sortOrder } = req.query;
      const userId = req.user.id;

      page = parseInt(page, 10) || 1;
      limit = parseInt(limit, 10) || 8;

      let offset = (page - 1) * limit;
      const sort = formatStatusForSort(sortBy, sortOrder);

      const options = {
        limit,
        offset,
        userId,
        page,
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder,
      };

      const groupsWithOptions = await this.groupService.findGroupsByOptions(options);

      return res.json(groupsWithOptions);
    } catch (error) {
      next(error);
    }
  }
  async updateGroup(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const userId = req.user.id;

      const updatedGroup = await this.groupService.updateGroup(id, userId, name);

      return res.json(updatedGroup);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GroupController;
