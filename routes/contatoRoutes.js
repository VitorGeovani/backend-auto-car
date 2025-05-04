import express from 'express';
import ContatoController from '../controllers/ContatoController.js';

const router = express.Router();

router.post('/', ContatoController.enviar);

export default router;