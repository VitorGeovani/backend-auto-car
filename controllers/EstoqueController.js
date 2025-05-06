import estoqueService from '../services/estoqueService.js';
import carroService from '../services/carroService.js';
import estoqueRepository from '../repository/estoqueRepository.js';

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
      
      // Verificar se o ID é válido antes de tentar buscar
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ mensagem: 'ID de estoque inválido' });
      }
      
      // Tentar buscar direto do repositório para evitar erros
      const item = await estoqueRepository.buscarPorId(id);
      
      if (!item) {
        return res.status(404).json({ mensagem: 'Item de estoque não encontrado' });
      }
      
      res.status(200).json(item);
    } catch (error) {
      console.error('Erro ao buscar item de estoque:', error);
      res.status(500).json({ mensagem: 'Erro ao buscar item de estoque', erro: error.message });
    }
  },
  
  buscarPorCarro: async (req, res) => {
    try {
      const { carroId } = req.params;
      
      if (!carroId || isNaN(parseInt(carroId))) {
        return res.status(400).json({ mensagem: 'ID do carro inválido' });
      }
      
      // MODIFICADO: Verificar primeiro se o carro existe
      try {
        const carro = await carroService.buscarPorId(carroId);
        if (!carro) {
          return res.status(404).json({ 
            mensagem: 'Carro não encontrado',
            existe: false
          });
        }
      } catch (carroError) {
        console.warn(`Aviso: Erro ao verificar existência do carro ${carroId}:`, carroError);
        // Continuar mesmo se houver erro na verificação do carro
      }
      
      // Buscar do repositório diretamente para evitar erros de serviço
      const item = await estoqueRepository.buscarPorCarroId(carroId);
      
      // Se não existir, retornar objeto padrão em vez de erro 404
      if (!item) {
        return res.status(200).json({ 
          carro_id: parseInt(carroId),
          quantidade: 0,
          localizacao: 'Matriz', // Valor padrão útil para frontend
          existe: false
        });
      }
      
      // Adicionar flag para indicar que existe no estoque
      item.existe = true;
      res.status(200).json(item);
    } catch (error) {
      console.error('Erro ao buscar estoque por carro:', error);
      // MODIFICADO: Mesmo em caso de erro, retornar um objeto válido para o frontend
      res.status(200).json({ 
        carro_id: parseInt(req.params.carroId),
        quantidade: 0,
        localizacao: 'Matriz',
        existe: false,
        erro: error.message
      });
    }
  },
  
  adicionar: async (req, res) => {
    try {
      const { carro_id, quantidade, localizacao } = req.body;
      
      if (!carro_id || isNaN(parseInt(carro_id))) {
        return res.status(400).json({
          mensagem: 'Dados incompletos. carro_id é obrigatório.'
        });
      }
      
      // MODIFICADO: quantidade é opcional, usar valor padrão se não fornecido
      const qtd = quantidade === undefined ? 1 : parseInt(quantidade);
      
      // Verificar se o carro existe
      const carro = await carroService.buscarPorId(carro_id);
      if (!carro) {
        return res.status(404).json({ mensagem: 'Carro não encontrado' });
      }
      
      // Verificar se já existe um registro para este carro
      const estoqueExistente = await estoqueRepository.buscarPorCarroId(carro_id);
      
      let novoItem;
      if (estoqueExistente) {
        // Se já existir, atualizar em vez de criar
        novoItem = await estoqueRepository.atualizar(estoqueExistente.id, {
          quantidade: qtd,
          localizacao: localizacao || estoqueExistente.localizacao
        });
        
        res.status(200).json({
          mensagem: 'Item de estoque atualizado com sucesso',
          item: novoItem
        });
      } else {
        // Se não existir, criar novo
        novoItem = await estoqueRepository.adicionar({
          carro_id: parseInt(carro_id),
          quantidade: qtd,
          localizacao: localizacao || 'Matriz'
        });
        
        res.status(201).json({
          mensagem: 'Item adicionado ao estoque com sucesso',
          item: novoItem
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar item ao estoque:', error);
      res.status(500).json({ mensagem: 'Erro ao adicionar item ao estoque', erro: error.message });
    }
  },
  
  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { quantidade, localizacao } = req.body;
      
      // MODIFICADO: quantidade agora é opcional
      if (quantidade === undefined && localizacao === undefined) {
        return res.status(400).json({
          mensagem: 'Nenhum dado fornecido para atualização.'
        });
      }
      
      // Verificar se o item existe
      const itemExistente = await estoqueRepository.buscarPorId(id);
      
      if (!itemExistente) {
        return res.status(404).json({ mensagem: 'Item de estoque não encontrado' });
      }
      
      // MODIFICADO: Usar valores existentes se não fornecidos
      const dadosAtualizacao = {
        quantidade: quantidade !== undefined ? parseInt(quantidade) : itemExistente.quantidade,
        localizacao: localizacao || itemExistente.localizacao || 'Matriz'
      };
      
      const itemAtualizado = await estoqueRepository.atualizar(id, dadosAtualizacao);
      
      res.status(200).json({
        mensagem: 'Item de estoque atualizado com sucesso',
        item: itemAtualizado
      });
    } catch (error) {
      console.error('Erro ao atualizar item de estoque:', error);
      res.status(500).json({ mensagem: 'Erro ao atualizar item de estoque', erro: error.message });
    }
  },
  
  atualizarPorCarro: async (req, res) => {
    try {
      const { carro_id, quantidade, localizacao } = req.body;
      
      if (!carro_id || isNaN(parseInt(carro_id))) {
        return res.status(400).json({
          mensagem: 'ID do carro é obrigatório'
        });
      }
      
      // Quantidade e localização são opcionais
      const qtd = quantidade === undefined ? 1 : parseInt(quantidade);
      
      // Verificar se o carro existe
      let carro;
      try {
        carro = await carroService.buscarPorId(carro_id);
      } catch (error) {
        console.warn(`Aviso: Erro ao verificar carro ${carro_id}:`, error);
      }
      
      if (!carro) {
        return res.status(404).json({ mensagem: 'Carro não encontrado' });
      }
      
      // Buscar direto do repositório para evitar erros de serviço
      const estoqueExistente = await estoqueRepository.buscarPorCarroId(carro_id);
      
      let resultado;
      if (estoqueExistente) {
        // Atualizar estoque existente
        resultado = await estoqueRepository.atualizar(estoqueExistente.id, {
          quantidade: qtd,
          localizacao: localizacao || estoqueExistente.localizacao || 'Matriz'
        });
        
        res.status(200).json({
          mensagem: 'Estoque do veículo atualizado com sucesso',
          item: resultado
        });
      } else {
        // Criar novo item de estoque
        resultado = await estoqueRepository.adicionar({
          carro_id: parseInt(carro_id),
          quantidade: qtd,
          localizacao: localizacao || 'Matriz'
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
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ mensagem: 'ID de estoque inválido' });
      }
      
      // Verificar se o item existe
      const item = await estoqueRepository.buscarPorId(id);
      
      if (!item) {
        // Se não existir, retornar sucesso (idempotente)
        return res.status(200).json({ 
          mensagem: 'Nenhuma ação necessária. Item não existe no estoque.' 
        });
      }
      
      await estoqueRepository.deletar(id);
      res.status(200).json({ mensagem: 'Item do estoque removido com sucesso' });
    } catch (error) {
      console.error('Erro ao remover item do estoque:', error);
      res.status(500).json({ mensagem: 'Erro ao remover item do estoque', erro: error.message });
    }
  },
  
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