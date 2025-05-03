import express from 'express';
const router = express.Router();
import CategoriaController from '../controllers/CategoriaController.js';

router.get('/categorias', CategoriaController.listar);
router.get('/categorias/:id', CategoriaController.buscar);
router.post('/categorias', CategoriaController.criar);
router.put('/categorias/:id', CategoriaController.atualizar);
router.delete('/categorias/:id', CategoriaController.deletar);

export default router;