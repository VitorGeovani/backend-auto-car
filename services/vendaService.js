import vendaRepository from '../repository/vendaRepository.js';
import carroRepository from '../repository/carroRepository.js';
import usuarioRepository from '../repository/usuarioRepository.js';
import estoqueRepository from '../repository/estoqueRepository.js';

export default {
  /**
   * Lista todas as vendas cadastradas
   */
  listar: async () => {
    try {
      return await vendaRepository.buscarTodas();
    } catch (error) {
      console.error('Erro ao listar vendas:', error);
      throw new Error('Não foi possível listar as vendas');
    }
  },

  /**
   * Busca uma venda específica por ID
   */
  buscarPorId: async (id) => {
    try {
      if (!id) {
        throw new Error('ID é obrigatório');
      }
      
      const venda = await vendaRepository.buscarPorId(id);
      if (!venda) {
        throw new Error('Venda não encontrada');
      }
      
      return venda;
    } catch (error) {
      console.error(`Erro ao buscar venda ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Busca vendas realizadas por um usuário específico
   */
  buscarPorUsuario: async (usuarioId) => {
    try {
      if (!usuarioId) {
        throw new Error('ID do usuário é obrigatório');
      }
      
      // Verificar se o usuário existe
      const usuario = await usuarioRepository.buscarPorId(usuarioId);
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }
      
      return await vendaRepository.buscarPorUsuario(usuarioId);
    } catch (error) {
      console.error(`Erro ao buscar vendas do usuário ${usuarioId}:`, error);
      throw error;
    }
  },

  /**
   * Busca vendas de um modelo específico de carro
   */
  buscarPorCarro: async (carroId) => {
    try {
      if (!carroId) {
        throw new Error('ID do carro é obrigatório');
      }
      
      // Verificar se o carro existe
      const carro = await carroRepository.buscarPorId(carroId);
      if (!carro) {
        throw new Error('Carro não encontrado');
      }
      
      return await vendaRepository.buscarPorCarro(carroId);
    } catch (error) {
      console.error(`Erro ao buscar vendas do carro ${carroId}:`, error);
      throw error;
    }
  },

  /**
   * Busca vendas em um período específico
   */
  buscarPorPeriodo: async (dataInicio, dataFim) => {
    try {
      if (!dataInicio || !dataFim) {
        throw new Error('Data de início e fim são obrigatórias');
      }
      
      // Validar formato das datas
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      
      if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
        throw new Error('Formato de data inválido');
      }
      
      // Validar ordem das datas
      if (inicio > fim) {
        throw new Error('Data de início deve ser anterior à data de fim');
      }
      
      return await vendaRepository.buscarPorPeriodo(dataInicio, dataFim);
    } catch (error) {
      console.error('Erro ao buscar vendas por período:', error);
      throw error;
    }
  },

  /**
   * Retorna o total de vendas realizadas
   */
  contarTotal: async () => {
    try {
      return await vendaRepository.contarTotal();
    } catch (error) {
      console.error('Erro ao contar vendas:', error);
      throw error;
    }
  },

  /**
   * Calcula o valor total de todas as vendas
   */
  calcularFaturamentoTotal: async () => {
    try {
      return await vendaRepository.somarValores();
    } catch (error) {
      console.error('Erro ao calcular faturamento:', error);
      throw error;
    }
  },

  /**
   * Calcula o valor médio das vendas
   */
  calcularTicketMedio: async () => {
    try {
      return await vendaRepository.calcularMediaVendas();
    } catch (error) {
      console.error('Erro ao calcular ticket médio:', error);
      throw error;
    }
  },

  /**
   * Registra uma nova venda
   */
  registrar: async (dados) => {
    try {
      // Validar dados obrigatórios
      if (!dados.valor_final) {
        throw new Error('Valor da venda é obrigatório');
      }
      
      if (!dados.carro_id) {
        throw new Error('ID do carro é obrigatório');
      }
      
      if (!dados.usuario_id) {
        throw new Error('ID do usuário é obrigatório');
      }
      
      // Verificar se usuário existe
      const usuario = await usuarioRepository.buscarPorId(dados.usuario_id);
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }
      
      // Verificar se carro existe
      const carro = await carroRepository.buscarPorId(dados.carro_id);
      if (!carro) {
        throw new Error('Carro não encontrado');
      }
      
      // Verificar estoque antes da venda
      const estoque = await estoqueRepository.buscarPorCarroId(dados.carro_id);
      if (!estoque || estoque.quantidade <= 0) {
        throw new Error('Carro indisponível em estoque');
      }
      
      // Tudo validado, registrar a venda
      const venda = await vendaRepository.inserir(dados);
      
      // Atualizar estoque após a venda
      await estoqueRepository.reduzirQuantidade(dados.carro_id, 1);
      
      return venda;
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      throw error;
    }
  },

  /**
   * Atualiza os dados de uma venda existente
   */
  atualizar: async (id, dados) => {
    try {
      if (!id) {
        throw new Error('ID da venda é obrigatório');
      }
      
      // Verificar se a venda existe
      const venda = await vendaRepository.buscarPorId(id);
      if (!venda) {
        throw new Error('Venda não encontrada');
      }
      
      // Validar campos obrigatórios
      if (!dados.valor_final) {
        throw new Error('Valor da venda é obrigatório');
      }
      
      // Verificar se o usuário existe (se for atualizado)
      if (dados.usuario_id && dados.usuario_id !== venda.usuario_id) {
        const usuario = await usuarioRepository.buscarPorId(dados.usuario_id);
        if (!usuario) {
          throw new Error('Usuário não encontrado');
        }
      }
      
      // Verificar se o carro existe (se for atualizado)
      if (dados.carro_id && dados.carro_id !== venda.carro_id) {
        const carro = await carroRepository.buscarPorId(dados.carro_id);
        if (!carro) {
          throw new Error('Carro não encontrado');
        }
        
        // Se mudar o carro, precisa gerenciar o estoque
        // Aumentar estoque do carro antigo
        await estoqueRepository.aumentarQuantidade(venda.carro_id, 1);
        
        // Diminuir estoque do novo carro
        const novoEstoque = await estoqueRepository.buscarPorCarroId(dados.carro_id);
        if (!novoEstoque || novoEstoque.quantidade <= 0) {
          throw new Error('Novo carro indisponível em estoque');
        }
        await estoqueRepository.reduzirQuantidade(dados.carro_id, 1);
      }
      
      return await vendaRepository.atualizar(id, dados);
    } catch (error) {
      console.error(`Erro ao atualizar venda ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Exclui uma venda
   */
  excluir: async (id) => {
    try {
      if (!id) {
        throw new Error('ID da venda é obrigatório');
      }
      
      // Verificar se a venda existe
      const venda = await vendaRepository.buscarPorId(id);
      if (!venda) {
        throw new Error('Venda não encontrada');
      }
      
      // Devolver o carro ao estoque
      await estoqueRepository.aumentarQuantidade(venda.carro_id, 1);
      
      return await vendaRepository.excluir(id);
    } catch (error) {
      console.error(`Erro ao excluir venda ID ${id}:`, error);
      throw error;
    }
  }
};