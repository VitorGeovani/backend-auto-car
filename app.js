import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Para obter o __dirname no ES modules (não disponível nativamente)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config();

// Importar rotas
import usuarioRoutes from './routes/usuarioRoutes.js';
import carroRoutes from './routes/carroRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import estoqueRoutes from './routes/estoqueRoutes.js';
import imagemRoutes from './routes/imagemRoutes.js';
import agendamentoRoutes from './routes/agendamentoRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import interesseRoutes from './routes/interesseRoutes.js';

// Inicializar app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Registrar rotas de autenticação PRIMEIRO
app.use('/auth', authRoutes);

// Registrar outras rotas
app.use('/', usuarioRoutes);
app.use('/', carroRoutes);
app.use('/', categoriaRoutes);
app.use('/', estoqueRoutes);
app.use('/imagens', imagemRoutes);
app.use('/', agendamentoRoutes);
app.use('/', adminRoutes);
app.use('/api', interesseRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.send('API Auto Car rodando!');
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ mensagem: 'Endpoint não encontrado' });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  res.status(500).json({ mensagem: 'Erro interno no servidor' });
});

export default app;