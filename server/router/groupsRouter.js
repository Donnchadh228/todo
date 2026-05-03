const Router = require('express');
const router = new Router();

const groupController = require('../controllers/groupController');

const { groupValidation } = require('../validation/groupValidation');

router.post('/', groupValidation, groupController.createGroup);
router.get('/', groupController.getAllGroups);
router.put('/:id', groupValidation, groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);

module.exports = router;
