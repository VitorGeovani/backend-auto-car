import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import imagemController from '../controllers/ImagemController.js';

// Obter dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Criar o diretório de upload se não existir
const uploadDir = path.join(__dirname, '..', 'uploads', 'carros');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'car-' + uniqueSuffix + ext);
  }
});

// Configurar o filtro de arquivos
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos!'));
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter
});

// Rotas - IMPORTANTE: a ordem foi alterada para colocar as mais específicas primeiro
// Rotas GET e POST
router.post('/carro/:id', upload.array('imagens', 10), imagemController.uploadImagens);
router.get('/carro/:id', imagemController.buscarPorCarroId);

// Rotas DELETE - as mais específicas primeiro
router.delete('/carro/:carroId', imagemController.excluirImagensDoCarro);
router.delete('/arquivo/:nomeArquivo', (req, res) => {
  const { nomeArquivo } = req.params;
  const filePath = path.join(uploadDir, nomeArquivo);
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      // Chamar o controller para excluir do banco de dados
      imagemController.excluirPorNomeArquivo(req, res);
    } else {
      return res.status(404).json({ erro: 'Arquivo não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao excluir arquivo:', error);
    return res.status(500).json({ erro: 'Erro ao excluir arquivo' });
  }
});

// A rota genérica por último
router.delete('/:id', imagemController.excluir);

export default router;