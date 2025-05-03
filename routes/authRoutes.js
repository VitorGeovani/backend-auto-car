import express from 'express';
const router = express.Router();
import AuthController from '../controllers/AuthController.js';

// Rotas de autenticação
router.post('/usuario/login', AuthController.loginUsuario);
router.post('/admin/login', AuthController.loginAdmin);
router.get('/verificar', AuthController.verificarToken);

export default router;