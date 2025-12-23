const Router = require("express");
const router = new Router();

const groupController = require("../controllers/groupController");
const { groupValidation } = require("../validation/groupValidation");

// create - get - remove - change

router.post("/", groupValidation, groupController.createGroup);
router.get("/", groupController.getAllGroup);
router.delete("/:id", groupController.removeGroup);
router.put("/:id", groupValidation, groupController.changeGroup);

module.exports = router;
