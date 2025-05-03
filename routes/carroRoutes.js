import express from 'express';
const router = express.Router();
import CarroController from '../controllers/CarroController.js';

router.get('/carros', CarroController.listar);
router.get('/carros/:id', CarroController.buscar);
router.post('/carros', CarroController.criar);
router.delete('/carros/:id', CarroController.deletar);

export default router;