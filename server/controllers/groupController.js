const groupService = require('../service/groupService');

class GroupController {
  async createGroup(req, res, next) {
    try {
      const { name } = req.body;
      const userId = req.user.id;

      const group = await groupService.createGroup(name, userId);

      return res.json(group);
    } catch (error) {
      next(error);
    }
  }
  async deleteGroup(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const deletedGroup = await groupService.deleteGroup(id, userId);

      return res.json(deletedGroup);
    } catch (error) {
      next(error);
    }
  }
  async getAllGroups(req, res, next) {
    try {
      let { limit, page, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      const { id: userId } = req.user;

      page = parseInt(page, 10) || 1;
      limit = parseInt(limit, 10) || 8;

      let offset = (page - 1) * limit;

      const options = {
        limit,
        offset,
        userId,
        page,
        sortBy,
        sortOrder,
      };

      const groups = await groupService.getAllGroups(options);

      return res.json(groups);
    } catch (error) {
      next(error);
    }
  }
  async updateGroup(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const userId = req.user.id;

      const updatedGroup = await groupService.updateGroup(id, name, userId);

      return res.json(updatedGroup);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GroupController();
