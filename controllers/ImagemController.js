import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import imagemService from '../services/imagemService.js';
import pool from '../config/database.js';

// Obter dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ImagemController = {
  // Upload de imagens para um carro
  uploadImagens: async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ erro: 'Nenhum arquivo enviado' });
      }
      
      const imagens = [];
      
      // Processar cada arquivo
      for (const file of req.files) {
        // Caminho relativo para salvar no banco
        const url = `/uploads/carros/${file.filename}`;
        const imagem = await imagemService.salvar(id, url);
        imagens.push(imagem);
      }
      
      res.status(201).json(imagens);
    } catch (error) {
      console.error('Erro ao fazer upload de imagens:', error);
      res.status(500).json({ erro: 'Erro interno ao processar upload de imagens' });
    }
  },

  // Buscar imagens por ID do carro
  buscarPorCarroId: async (req, res) => {
    try {
      const { id } = req.params;
      
      const imagens = await imagemService.buscarPorCarroId(id);
      
      res.json(imagens);
    } catch (error) {
      console.error('Erro ao buscar imagens do carro:', error);
      res.status(500).json({ erro: 'Erro interno ao buscar imagens' });
    }
  },

  // Excluir uma imagem
  excluir: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Buscar a imagem para obter o caminho do arquivo
      const imagem = await imagemService.buscarPorId(id);
      
      if (!imagem) {
        return res.status(404).json({ erro: 'Imagem não encontrada' });
      }
      
      // Caminho completo do arquivo físico
      const filePath = path.join(__dirname, '..', imagem.url.startsWith('/') ? imagem.url.substring(1) : imagem.url);
      
      // Remover arquivo se existir
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Arquivo físico excluído:', filePath);
      } else {
        console.log('Arquivo físico não encontrado:', filePath);
      }
      
      // Excluir registro do banco de dados
      await imagemService.excluir(id);
      
      res.json({ mensagem: 'Imagem excluída com sucesso', id });
    } catch (error) {
      console.error('Erro ao excluir imagem:', error);
      res.status(500).json({ erro: 'Erro interno ao excluir imagem' });
    }
  },

  // Excluir todas as imagens de um carro
  excluirImagensDoCarro: async (req, res) => {
    try {
      const { carroId } = req.params;
      
      // Buscar todas as imagens do carro
      const imagens = await imagemService.buscarPorCarroId(carroId);
      console.log(`Encontradas ${imagens.length} imagens para o carro ID ${carroId}`);
      
      // Excluir os arquivos físicos
      for (const imagem of imagens) {
        // Corrigir o caminho - a URL pode começar com / então precisamos ajustar
        const caminhoRelativo = imagem.url.startsWith('/') 
          ? imagem.url.substring(1) 
          : imagem.url;
          
        const filePath = path.join(__dirname, '..', caminhoRelativo);
        console.log('Tentando excluir arquivo:', filePath);
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log('Arquivo excluído:', filePath);
        } else {
          console.log('Arquivo não encontrado:', filePath);
        }
      }
      
      // Excluir registros do banco de dados
      const resultado = await imagemService.excluirPorCarroId(carroId);
      console.log('Resultado da exclusão no banco:', resultado);
      
      res.json({ 
        mensagem: 'Todas as imagens do veículo foram excluídas com sucesso',
        quantidadeExcluida: imagens.length
      });
    } catch (error) {
      console.error('Erro ao excluir imagens do carro:', error);
      res.status(500).json({ erro: 'Erro interno ao excluir imagens do carro' });
    }
  },

  // Excluir por nome de arquivo
  excluirPorNomeArquivo: async (req, res, nomeArquivo = null) => {
    try {
      const fileName = nomeArquivo || req.params.nomeArquivo;
      console.log('Excluindo imagem pelo nome do arquivo:', fileName);
      
      // Buscar todas as imagens
      const [imagens] = await pool.execute('SELECT * FROM imagens WHERE url LIKE ?', [`%${fileName}%`]);
      
      if (imagens.length === 0) {
        console.log('Nenhuma imagem encontrada com este nome de arquivo');
        return res.json({ 
          mensagem: 'Arquivo físico excluído, mas nenhum registro correspondente foi encontrado no banco de dados'
        });
      }
      
      // Excluir o registro do banco
      const imagemId = imagens[0].id;
      await imagemService.excluir(imagemId);
      
      return res.json({ 
        mensagem: 'Imagem excluída com sucesso',
        id: imagemId
      });
    } catch (error) {
      console.error('Erro ao excluir imagem por nome de arquivo:', error);
      if (res && !res.headersSent) {
        res.status(500).json({ erro: 'Erro ao excluir imagem por nome de arquivo' });
      }
    }
  }
};

// Para compatibilidade com apiRoutes.js
ImagemController.upload = ImagemController.uploadImagens;
ImagemController.deletar = ImagemController.excluir;

export default ImagemController;