import estoqueService from '../services/estoqueService.js';
import carroService from '../services/carroService.js';

const EstoqueController = {
  listar: async (req, res) => {
    try {
      const estoque = await estoqueService.listarTodos();
      res.status(200).json(estoque);
    } catch (error) {
      console.error('Erro ao listar estoque:', error);
      res.status(500).json({ mensagem: 'Erro ao listar estoque', erro: error.message });
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
      res.status(500).json({ mensagem: 'Erro ao buscar item de estoque', erro: error.message });
    }
  },
  
  adicionar: async (req, res) => {
    try {
      const { carro_id, quantidade, localizacao } = req.body;
      
      if (!carro_id || isNaN(parseInt(carro_id)) || !quantidade) {
        return res.status(400).json({
          mensagem: 'Dados incompletos. carro_id e quantidade são obrigatórios.'
        });
      }
      
      // Verificar se o carro existe
      const carro = await carroService.buscarPorId(carro_id);
      if (!carro) {
        return res.status(404).json({ mensagem: 'Carro não encontrado' });
      }
      
      const novoItem = await estoqueService.adicionar({
        carro_id: parseInt(carro_id),
        quantidade: parseInt(quantidade),
        localizacao: localizacao || ''
      });
      
      res.status(201).json({
        mensagem: 'Item adicionado ao estoque com sucesso',
        item: novoItem
      });
    } catch (error) {
      console.error('Erro ao adicionar item ao estoque:', error);
      res.status(500).json({ mensagem: 'Erro ao adicionar item ao estoque', erro: error.message });
    }
  },
  
  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { quantidade, localizacao } = req.body;
      
      if (!quantidade) {
        return res.status(400).json({
          mensagem: 'A quantidade é obrigatória.'
        });
      }
      
      const itemAtualizado = await estoqueService.atualizar(id, {
        quantidade: parseInt(quantidade),
        localizacao: localizacao || ''
      });
      
      res.status(200).json({
        mensagem: 'Item de estoque atualizado com sucesso',
        item: itemAtualizado
      });
    } catch (error) {
      console.error('Erro ao atualizar item de estoque:', error);
      res.status(500).json({ mensagem: 'Erro ao atualizar item de estoque', erro: error.message });
    }
  },
  
  // Nova função para atualizar estoque pelo ID do carro
  atualizarPorCarro: async (req, res) => {
    try {
      const { carro_id, quantidade, localizacao } = req.body;
      
      if (!carro_id || isNaN(parseInt(carro_id)) || !quantidade) {
        return res.status(400).json({
          mensagem: 'Dados incompletos. carro_id e quantidade são obrigatórios.'
        });
      }
      
      // Verificar se o carro existe
      const carro = await carroService.buscarPorId(carro_id);
      if (!carro) {
        return res.status(404).json({ mensagem: 'Carro não encontrado' });
      }
      
      // Verificar se já existe estoque para este carro
      const estoqueExistente = await estoqueService.buscarPorCarroId(carro_id);
      
      let resultado;
      if (estoqueExistente) {
        // Atualizar estoque existente
        resultado = await estoqueService.atualizar(estoqueExistente.id, {
          quantidade: parseInt(quantidade),
          localizacao: localizacao || ''
        });
        
        res.status(200).json({
          mensagem: 'Estoque do veículo atualizado com sucesso',
          item: resultado
        });
      } else {
        // Criar novo item de estoque
        resultado = await estoqueService.adicionar({
          carro_id: parseInt(carro_id),
          quantidade: parseInt(quantidade),
          localizacao: localizacao || ''
        });
        
        res.status(201).json({
          mensagem: 'Novo estoque do veículo criado com sucesso',
          item: resultado
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar estoque por carro_id:', error);
      res.status(500).json({ 
        mensagem: 'Erro ao atualizar estoque do veículo', 
        erro: error.message 
      });
    }
  },
  
  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      await estoqueService.deletar(id);
      
      res.status(200).json({ mensagem: 'Item do estoque removido com sucesso' });
    } catch (error) {
      console.error('Erro ao remover item do estoque:', error);
      res.status(500).json({ mensagem: 'Erro ao remover item do estoque', erro: error.message });
    }
  },
  
  // Função para revalidar todo o estoque
  revalidarEstoque: async (req, res) => {
    try {
      const resultado = await estoqueService.revalidarEstoque();
      
      res.status(200).json({ 
        mensagem: 'Estoque revalidado com sucesso',
        resultado
      });
    } catch (error) {
      console.error('Erro ao revalidar estoque:', error);
      res.status(500).json({ 
        mensagem: 'Erro ao revalidar estoque', 
        erro: error.message 
      });
    }
  }
};

export default EstoqueController;