import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obter dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Controllers
import carroController from '../controllers/CarroController.js';
import estoqueController from '../controllers/EstoqueController.js';
import imagemController from '../controllers/ImagemController.js';
import categoriaController from '../controllers/CategoriaController.js';
import usuarioController from '../controllers/UsuarioController.js';

const router = express.Router();

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = file.originalname.split('.').pop();
    cb(null, `${uniqueSuffix}.${extension}`);
  }
});

const upload = multer({ storage });

// Rotas para carros
router.get('/carros', carroController.listar);
router.get('/carros/:id', carroController.buscar);
router.post('/carros', carroController.criar);
router.put('/carros/:id', carroController.atualizar);
router.delete('/carros/:id', carroController.deletar);

// Rotas para estoque
router.get('/estoque', estoqueController.listar);
router.get('/estoque/:id', estoqueController.buscar);
router.post('/estoque', estoqueController.adicionar);
router.put('/estoque/:id', estoqueController.atualizar);
router.delete('/estoque/:id', estoqueController.deletar);

// Rotas para imagens
// As rotas de imagens agora estão em imagemRoutes.js

// Rotas para categorias
router.get('/categorias', categoriaController.listar);
router.get('/categorias/:id', categoriaController.buscar);
router.post('/categorias', categoriaController.criar);
router.put('/categorias/:id', categoriaController.atualizar);
router.delete('/categorias/:id', categoriaController.deletar);

// Rotas para usuários
router.get('/usuarios', usuarioController.listar);
router.get('/usuarios/:id', usuarioController.buscarPorId);
router.post('/usuarios', usuarioController.cadastrar);
router.put('/usuarios/:id', usuarioController.atualizar);
router.delete('/usuarios/:id', usuarioController.deletar);

export default router;