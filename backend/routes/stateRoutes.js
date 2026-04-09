const express = require('express');
const router = express.Router();

const stateController = require('../controllers/stateController');

// CREATE
router.post('/', stateController.createState);

// READ
router.get('/', stateController.getAllStates);

// UPDATE
router.put('/:id', stateController.updateState);

// DELETE
router.delete('/:id', stateController.deleteState);

module.exports = router;