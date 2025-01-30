const express = require('express');
const router = express.Router();
const gestorController = require('../controllers/gestorController');
const { verifyToken } = require('../middleware/authMiddleware');
const { isGestor } = require('../middleware/gestorMiddleware');

// Solo el superadmin puede gestionar administradores
router.post('/admin', verifyToken, isGestor, gestorController.createAdmin);
router.get('/admins', verifyToken, isGestor, gestorController.getAllAdmins);
router.put('/admin', verifyToken, isGestor, gestorController.updateAdmin);
router.delete('/admin/:id_usr', verifyToken, isGestor, gestorController.deleteAdmin);

router.post('/agencia', verifyToken, isGestor, gestorController.createAgencia);
router.get('/agencias', verifyToken, isGestor, gestorController.getAllAgencias);
router.get('/agencia/:id_agencia', verifyToken, isGestor, gestorController.getAgenciaById);
router.put('/agencia', verifyToken, isGestor, gestorController.updateAgencia);
router.delete('/agencia/:id_agencia', verifyToken, isGestor, gestorController.deleteAgencia);


module.exports = router;

