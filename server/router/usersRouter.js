const Router = require("express");
const router = new Router();

const userController = require("../controllers/userController");
const { authValidation } = require("../validation/authValidation");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/registration", authValidation, userController.registration);
router.post("/login", authValidation, userController.login);
router.delete("/logout/:tokenId", userController.logout);

router.get("/check", authMiddleware, userController.check);
router.post("/refresh", userController.refresh);

module.exports = router;
