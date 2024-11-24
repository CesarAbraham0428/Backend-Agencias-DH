const express = require('express');
const router = express.Router();

const FoursquareController = require('../../controllers/apis/foursquareController');

// Ruta para buscar lugares
router.get('/buscar-lugar', FoursquareController.buscarLugar);

module.exports = router;
