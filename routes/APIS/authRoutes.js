// routes\apis\authRoutes.js
const express = require('express');
const router = express.Router();
const { login, verifySuperToken } = require('../../controllers/apis/authController');

router.post('/login', login);
router.post('/verify-token', verifySuperToken); // Solo esta ruta es necesaria

module.exports = router;