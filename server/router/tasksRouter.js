const Router = require('express');
const router = new Router();

const taskController = require('../controllers/taskController');
const { taskValidation } = require('../validation/taskValidation');

router.post('/', taskValidation, taskController.createTask);

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTask);

router.put('/:id', taskValidation, taskController.updateTask);

router.delete('/:id', taskController.deleteTask);

module.exports = router;
