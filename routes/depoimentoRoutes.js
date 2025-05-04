import express from 'express';
import DepoimentoController from '../controllers/DepoimentoController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/middleware.js';

const router = express.Router();

// Rotas públicas
router.get('/', DepoimentoController.listar); // Lista depoimentos aprovados
router.post('/', DepoimentoController.criar); // Cria novo depoimento (via formulário de contato)

// Rotas administrativas (protegidas)
router.get('/admin', adminMiddleware, DepoimentoController.listarAdmin); // Lista todos os depoimentos para admin
router.get('/:id', adminMiddleware, DepoimentoController.buscarPorId);
router.put('/:id', adminMiddleware, DepoimentoController.atualizar); // Aprovar/reprovar
router.delete('/:id', adminMiddleware, DepoimentoController.excluir);

export default router;