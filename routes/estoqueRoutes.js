import express from 'express';
const router = express.Router();
import EstoqueController from '../controllers/EstoqueController.js';
import { adminMiddleware } from '../middlewares/middleware.js';

// IMPORTANTE: Ordem das rotas - As mais específicas vêm PRIMEIRO!

// 1. Rotas específicas para operações especiais (sem parâmetros variáveis)
router.get('/estoque', EstoqueController.listar);
router.post('/estoque', EstoqueController.adicionar);

// 2. Rotas especiais com nomes fixos (devem vir antes das rotas com parâmetros)
router.post('/estoque/atualizar', adminMiddleware, EstoqueController.atualizarPorCarro);
router.post('/estoque/revalidar', adminMiddleware, EstoqueController.revalidarEstoque);
router.get('/estoque/revalidar', adminMiddleware, EstoqueController.revalidarEstoque);

// 3. Rota específica para buscar por carro_id
router.get('/estoque/carro/:carroId', EstoqueController.buscarPorCarro);

// 4. Por último, rotas com parâmetros genéricos
router.get('/estoque/:id', EstoqueController.buscar);
router.put('/estoque/:id', EstoqueController.atualizar);
router.delete('/estoque/:id', EstoqueController.deletar);

export default router;