const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');

// Create; Read; Update; Delete routes for ServiceShare
router.post('/', shareController.createServiceShare);
router.get('/', shareController.getAllServiceShares);
router.get('/:id', shareController.getServiceShareById);
router.put('/:id', shareController.updateServiceShare);
router.delete('/:id', shareController.deleteServiceShare);

module.exports = router;