import categoriaModel from '../models/Categoria.js';

const CategoriaController = {
  listar: async (req, res) => {
    try {
      const categorias = await categoriaModel.buscarTodas();
      res.status(200).json(categorias);
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      res.status(500).json({ mensagem: 'Erro ao listar categorias' });
    }
  },

  buscar: async (req, res) => {
    try {
      const { id } = req.params;
      const categoria = await categoriaModel.buscarPorId(id);
      
      if (!categoria) {
        return res.status(404).json({ mensagem: 'Categoria não encontrada' });
      }
      
      res.status(200).json(categoria);
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      res.status(500).json({ mensagem: 'Erro ao buscar categoria' });
    }
  },

  criar: async (req, res) => {
    try {
      const { nome, descricao } = req.body;
      
      if (!nome) {
        return res.status(400).json({ mensagem: 'Nome da categoria é obrigatório' });
      }
      
      const novaCategoria = await categoriaModel.inserir({ nome, descricao });
      
      res.status(201).json({ 
        mensagem: 'Categoria criada com sucesso',
        categoria: novaCategoria
      });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      res.status(500).json({ mensagem: 'Erro ao criar categoria' });
    }
  },

  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, descricao } = req.body;
      
      if (!nome) {
        return res.status(400).json({ mensagem: 'Nome da categoria é obrigatório' });
      }
      
      const categoriaAtualizada = await categoriaModel.atualizar(id, { nome, descricao });
      
      res.status(200).json({ 
        mensagem: 'Categoria atualizada com sucesso',
        categoria: categoriaAtualizada
      });
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      res.status(500).json({ mensagem: 'Erro ao atualizar categoria' });
    }
  },

  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      await categoriaModel.deletar(id);
      
      res.status(200).json({ mensagem: 'Categoria deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      res.status(500).json({ mensagem: 'Erro ao deletar categoria' });
    }
  }
};

export default CategoriaController;