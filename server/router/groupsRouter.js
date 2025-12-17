const Router = require("express");
const router = new Router();

const groupController = require("../controllers/groupController");
const groupPermissionMiddleware = require("../middleware/groupPermissionMiddleware");
const { groupValidation } = require("../validation/groupValidation");

// create - get - remove - change

router.post("/", groupValidation, groupController.createGroup);
router.get("/", groupController.getAllGroup);
router.delete("/:id", groupPermissionMiddleware, groupController.removeGroup);
router.put("/:id", groupValidation, groupPermissionMiddleware, groupController.changeGroup);

module.exports = router;
