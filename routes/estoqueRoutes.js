import express from 'express';
const router = express.Router();
import EstoqueController from '../controllers/EstoqueController.js';

// Rotas principais de estoque - Atenção à ordem das rotas!
router.get('/estoque', EstoqueController.listar);
router.get('/estoque/:id', EstoqueController.buscar);
router.post('/estoque', EstoqueController.adicionar);
router.put('/estoque/:id', EstoqueController.atualizar);
router.delete('/estoque/:id', EstoqueController.deletar);

// Nova rota especial para atualização por ID do carro
// Esta deve vir depois das rotas com parâmetro :id para evitar conflitos
router.post('/estoque/atualizar', EstoqueController.atualizarPorCarro);
router.get('/estoque/revalidar', EstoqueController.revalidarEstoque);

export default router;