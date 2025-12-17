const Router = require("express");
const router = new Router();

const userController = require("../controllers/userController");
const { authValidation } = require("../validation/authValidation");

router.post("/registration", authValidation, userController.registration);
router.post("/login", authValidation, userController.login);
router.delete("/logout", userController.logout);

router.post("/refresh", userController.refresh);

module.exports = router;
