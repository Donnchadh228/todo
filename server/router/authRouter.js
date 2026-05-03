const Router = require('express');
const router = new Router();

const { authValidation } = require('../validation/authValidation');

const authMiddleware = require('../middleware/authMiddleware');

const AuthController = require('../controllers/AuthController.js');

router.post('/registration', authValidation, AuthController.registration);
router.post('/login', authValidation, AuthController.login);
router.post('/refresh', AuthController.refreshToken);

router.get('/check', authMiddleware, AuthController.check);

router.delete('/logout', AuthController.logout);

module.exports = router;
