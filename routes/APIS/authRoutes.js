// routes/apis/authRoutes.js
const express = require('express');
const router = express.Router();
const { 
  login, 
  verifySuperToken, 
  requestSuperToken 
} = require('../../controllers/apis/authController');

router.post('/login', login); // Para JWT (email + password)
router.post('/request-token', requestSuperToken); // Para solicitar SuperToken
router.post('/verify-token', verifySuperToken); // Para verificar SuperToken

module.exports = router;