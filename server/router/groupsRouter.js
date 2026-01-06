const Router = require("express");
const router = new Router();

const groupController = require("../controllers/groupController");
const { groupValidation } = require("../validation/groupValidation");

// create - get -  change - remove

router.post("/", groupValidation, groupController.createGroup);

router.get("/", groupController.getAllGroup);

router.put("/:id", groupValidation, groupController.changeGroup);

router.delete("/:id", groupController.removeGroup);

module.exports = router;
