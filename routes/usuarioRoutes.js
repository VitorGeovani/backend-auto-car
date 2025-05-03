import express from 'express';
const router = express.Router();
import UsuarioController from '../controllers/UsuarioController.js';

router.get('/usuarios', UsuarioController.listar);
router.get('/usuarios/:id', UsuarioController.buscarPorId);
router.post('/usuarios', UsuarioController.cadastrar);
router.put('/usuarios/:id', UsuarioController.atualizar);
router.delete('/usuarios/:id', UsuarioController.deletar);

export default router;