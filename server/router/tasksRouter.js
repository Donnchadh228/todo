const Router = require('express');
const router = new Router();

const { taskController } = require('../di.js');
const { taskValidation } = require('../validation/taskValidation');

router.post('/', taskValidation, taskController.createTask);

router.get('/', taskController.queryTasks);
router.get('/:id', taskController.getTask);

router.put('/:id', taskValidation, taskController.updateTask);

router.delete('/:id', taskController.deleteTask);

module.exports = router;
