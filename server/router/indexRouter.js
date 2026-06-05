const Router = require('express');
const router = new Router();

const authRouter = require('./authRouter');
const taskRouter = require('./tasksRouter');
const groupRouter = require('./groupsRouter');

const { authMiddleware } = require('../di.js');
// require('../swagger/groupDocs.js');
router.use('/task', authMiddleware, taskRouter);

// require('../swagger/authDocs.js');
router.use('/group', authMiddleware, groupRouter);
// require('../swagger/taskDocs.js');
router.use('/user', authRouter);

module.exports = router;
