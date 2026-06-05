const Router = require('express');
const router = new Router();

const { authValidation } = require('../validation/authValidation');

const { authController, authMiddleware } = require('../di.js');

router.post('/registration', authValidation, authController.registration);
router.post('/login', authValidation, authController.login);
router.post('/refresh', authController.refreshToken);

router.get('/check', authMiddleware, authController.check);

router.delete('/logout', authController.logout);

module.exports = router;
