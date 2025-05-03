import express from 'express';
const router = express.Router();
import InteresseController from '../controllers/InteresseController.js';
import { adminMiddleware } from '../middlewares/middleware.js';

// Rota pública para criação de interesse
router.post('/interesses', InteresseController.criar);

// Rotas protegidas (apenas admin)
router.get('/interesses', adminMiddleware, InteresseController.listar);
router.get('/interesses/:id', adminMiddleware, InteresseController.obterPorId);
router.put('/interesses/:id/lido', adminMiddleware, InteresseController.marcarComoLido);
router.delete('/interesses/:id', adminMiddleware, InteresseController.excluir);

export default router;