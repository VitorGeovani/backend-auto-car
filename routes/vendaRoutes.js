import express from 'express';
const router = express.Router();
import VendaController from '../controllers/VendaController.js';

router.get('/vendas', VendaController.listar);
router.post('/vendas', VendaController.registrar);

export default router;