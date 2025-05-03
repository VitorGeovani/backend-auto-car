import express from 'express';
const router = express.Router();
import AgendamentoController from '../controllers/AgendamentoController.js';

router.get('/agendamentos', AgendamentoController.listar);
router.post('/agendamentos', AgendamentoController.agendar);

export default router;