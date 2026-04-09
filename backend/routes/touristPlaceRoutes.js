const express = require('express');
const router = express.Router();
const placeController = require('../controllers/touristPlaceController');

router.post('/', placeController.createPlace);
router.get('/', placeController.getAllPlaces);
router.get('/:slug', placeController.getPlaceBySlug);

module.exports = router;