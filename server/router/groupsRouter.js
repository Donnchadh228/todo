const Router = require('express');
const router = new Router();

const { groupController } = require('../di.js');

const { groupValidation } = require('../validation/groupValidation');

router.post('/', groupValidation, groupController.createGroup);
router.get('/', groupController.queryGroups);
router.put('/:id', groupValidation, groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);

module.exports = router;
