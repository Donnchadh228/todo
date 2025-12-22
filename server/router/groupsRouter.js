const Router = require("express");
const router = new Router();

const groupController = require("../controllers/groupController");
const { groupValidation } = require("../validation/groupValidation");

const checkOwnership = require("../middleware/checkOwnershipMiddleware.js");
const { Group } = require("../models/indexModel.js");

const checkGroupOwnership = checkOwnership({
  model: Group,
  idParam: "id",
  ownershipField: "userId",
  reqKey: "project",
  errorMessage: "Вы не являетесь владельцем группы",
  notFoundMessage: "Группа не найдено",
});

// create - get - remove - change

router.post("/", groupValidation, groupController.createGroup);
router.get("/", groupController.getAllGroup);
router.delete("/:id", checkGroupOwnership, groupController.removeGroup);
router.put("/:id", checkGroupOwnership, groupValidation, groupController.changeGroup);

module.exports = router;
