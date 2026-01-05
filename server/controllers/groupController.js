const groupService = require("../service/groupService");

class GroupController {
  async createGroup(req, res, next) {
    try {
      const { name } = req.body;
      const userId = req.user.id;

      const group = await groupService.createGroup(name, userId);
      res.json(group);
    } catch (error) {
      next(error);
    }
  }
  async removeGroup(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const removedGroup = await groupService.removeGroup(id, userId);
      res.json(removedGroup);
    } catch (error) {
      next(error);
    }
  }
  async getAllGroup(req, res, next) {
    try {
      let { limit, page, sortBy = "createdAt", sortOrder = "desc" } = req.query;

      const { id: userId } = req.user;

      page = parseInt(page) || 1;
      limit = parseInt(limit) || 8;

      let offset = page * limit - limit;

      const options = {
        limit,
        offset,
        userId,
        page,
        sortBy,
        sortOrder,
      };

      const group = await groupService.getAllGroup(options);

      res.json(group);
    } catch (error) {
      next(error);
    }
  }
  async changeGroup(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const userId = req.user.id;
      const newGroup = await groupService.changeGroup(id, name, userId);
      res.json(newGroup);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GroupController();
