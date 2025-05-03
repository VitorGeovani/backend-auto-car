import express from 'express';
const router = express.Router();
import EstoqueController from '../controllers/EstoqueController.js';

router.get('/estoque', EstoqueController.listar);
router.get('/estoque/:id', EstoqueController.buscar);
router.post('/estoque', EstoqueController.adicionar);
router.put('/estoque/:id', EstoqueController.atualizar);
router.delete('/estoque/:id', EstoqueController.deletar);

export default router;