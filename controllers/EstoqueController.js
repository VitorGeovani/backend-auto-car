import estoqueService from '../services/estoqueService.js';

const EstoqueController = {
  listar: async (req, res) => {
    try {
      const estoque = await estoqueService.listarTodos();
      res.status(200).json(estoque);
    } catch (error) {
      console.error('Erro ao listar estoque:', error);
      res.status(500).json({ mensagem: 'Erro ao listar estoque' });
    }
  },

  buscar: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await estoqueService.buscarPorId(id);
      
      if (!item) {
        return res.status(404).json({ mensagem: 'Item de estoque não encontrado' });
      }
      
      res.status(200).json(item);
    } catch (error) {
      console.error('Erro ao buscar item de estoque:', error);
      res.status(500).json({ mensagem: 'Erro ao buscar item de estoque' });
    }
  },

  adicionar: async (req, res) => {
    try {
      const { carro_id, quantidade, localizacao } = req.body;
      
      // Validação dos dados recebidos
      if (!carro_id || quantidade === undefined) {
        return res.status(400).json({ 
          mensagem: 'ID do carro e quantidade são obrigatórios'
        });
      }

      // Conversão para os tipos corretos
      const dadosFormatados = {
        carro_id: parseInt(carro_id),
        quantidade: parseInt(quantidade),
        localizacao: localizacao || ''
      };

      const estoqueItem = await estoqueService.adicionar(dadosFormatados);
      
      res.status(201).json({ 
        mensagem: 'Item adicionado ao estoque com sucesso',
        item: estoqueItem
      });
    } catch (error) {
      console.error('Erro ao adicionar ao estoque:', error);
      res.status(500).json({ 
        mensagem: `Erro ao adicionar ao estoque: ${error.message}`
      });
    }
  },

  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { quantidade, localizacao } = req.body;
      
      if (quantidade === undefined) {
        return res.status(400).json({ 
          mensagem: 'Quantidade é obrigatória'
        });
      }
      
      const dadosFormatados = {
        quantidade: parseInt(quantidade),
        localizacao: localizacao || ''
      };
      
      const itemAtualizado = await estoqueService.atualizar(id, dadosFormatados);
      
      res.status(200).json({ 
        mensagem: 'Item de estoque atualizado com sucesso',
        item: itemAtualizado
      });
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      res.status(500).json({ 
        mensagem: `Erro ao atualizar estoque: ${error.message}`
      });
    }
  },

  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      await estoqueService.deletar(id);
      
      res.status(200).json({ 
        mensagem: 'Item de estoque deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar do estoque:', error);
      res.status(500).json({ 
        mensagem: `Erro ao deletar do estoque: ${error.message}`
      });
    }
  }
};

export default EstoqueController;