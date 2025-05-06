import express from 'express';
const router = express.Router();
import CarroController from '../controllers/CarroController.js';

router.get('/carros', CarroController.listar);
router.get('/carros/:id', CarroController.buscar);
router.post('/carros', CarroController.criar);
router.put('/carros/:id', CarroController.atualizar); // ADICIONAR ESTA LINHA
router.delete('/carros/:id', CarroController.deletar);

export default router;