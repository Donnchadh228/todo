const Router = require('express');
const router = new Router();

const taskRouter = require('./tasksRouter');
const groupRouter = require('./groupsRouter');
const authRouter = require('./authRouter');

const authMiddleware = require('../middleware/authMiddleware');

router.use('/task', authMiddleware, taskRouter);
router.use('/group', authMiddleware, groupRouter);
router.use('/user', authRouter);

module.exports = router;
