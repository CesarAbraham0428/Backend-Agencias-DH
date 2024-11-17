const express = require('express');
const router = express.Router();

const geolocationController = require('../../controllers/apis/geolocationController');

router.post('/servicios-cercanos', geolocationController.getNearbyServices);

module.exports = router;