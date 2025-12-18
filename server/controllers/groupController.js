const groupService = require("../service/groupService");

class GroupController {
  async createGroup(req, res, next) {
    try {
      const { name } = req.body;
      const { id: userId } = req.user;

      const group = await groupService.createGroup(name, userId);
      res.json(group);
    } catch (error) {
      next(error);
    }
  }
  async removeGroup(req, res, next) {
    try {
      const { id } = req.params;
      const removedGroup = await groupService.removeGroup(id);
      res.json(removedGroup);
    } catch (error) {
      next(error);
    }
  }
  async getAllGroup(req, res, next) {
    try {
      let { limit, page } = req.query;
      const { id: userId } = req.user;

      page = parseInt(page) || 1;
      limit = parseInt(limit) || 9;

      let offset = page * limit - limit;
      const group = await groupService.getAllGroup(limit, offset, userId);
      res.json(group);
    } catch (error) {
      next(error);
    }
  }
  async changeGroup(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const newGroup = await groupService.changeGroup(id, name);
      res.json(newGroup);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GroupController();
