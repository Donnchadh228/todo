const ApiError = require("../expectations/apiError.js");
const Group = require("../models/GroupModel.js");

module.exports = async (req, res, next) => {
  try {
    const groupId = req.params.id || req.body.id;
    const userId = req.user.id;
    const group = await Group.findByPk(groupId);

    if (!group) {
      return next(ApiError.BadRequest("Группа не найдена"));
    }
    if (group.userId !== userId) {
      return next(ApiError.BadRequest("У вас нет прав на эту группу"));
    }

    req.group = group;
    next();
  } catch (error) {
    console.error("Ошибка в middleware проверки прав:", error);
    return next(ApiError.BadRequest("Ошибка"));
  }
};
