import agendamentoRepository from '../repository/agendamentoRepository.js';
import carroRepository from '../repository/carroRepository.js';
import usuarioRepository from '../repository/usuarioRepository.js';

export default {
  /**
   * Lista todos os agendamentos
   */
  listar: async () => {
    try {
      return await agendamentoRepository.buscarTodos();
    } catch (error) {
      console.error('Erro ao listar agendamentos:', error);
      throw new Error('Não foi possível listar os agendamentos');
    }
  },

  /**
   * Busca um agendamento por ID
   */
  buscarPorId: async (id) => {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }

      const agendamento = await agendamentoRepository.buscarPorId(id);
      if (!agendamento) {
        throw new Error('Agendamento não encontrado');
      }
      
      return agendamento;
    } catch (error) {
      console.error(`Erro ao buscar agendamento ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Busca agendamentos por usuário
   */
  buscarPorUsuario: async (usuarioId) => {
    try {
      if (!usuarioId) {
        throw new Error('ID do usuário não fornecido');
      }

      const usuario = await usuarioRepository.buscarPorId(usuarioId);
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }

      return await agendamentoRepository.buscarPorUsuario(usuarioId);
    } catch (error) {
      console.error(`Erro ao buscar agendamentos do usuário ${usuarioId}:`, error);
      throw error;
    }
  },

  /**
   * Busca agendamentos por carro
   */
  buscarPorCarro: async (carroId) => {
    try {
      if (!carroId) {
        throw new Error('ID do carro não fornecido');
      }

      const carro = await carroRepository.buscarPorId(carroId);
      if (!carro) {
        throw new Error('Carro não encontrado');
      }

      return await agendamentoRepository.buscarPorCarro(carroId);
    } catch (error) {
      console.error(`Erro ao buscar agendamentos do carro ${carroId}:`, error);
      throw error;
    }
  },

  /**
   * Busca agendamentos por status
   */
  buscarPorStatus: async (status) => {
    try {
      if (!status) {
        throw new Error('Status não fornecido');
      }

      // Valida status permitidos
      const statusPermitidos = ['pendente', 'confirmado', 'cancelado', 'concluido'];
      if (!statusPermitidos.includes(status)) {
        throw new Error('Status inválido');
      }

      return await agendamentoRepository.buscarPorStatus(status);
    } catch (error) {
      console.error(`Erro ao buscar agendamentos com status ${status}:`, error);
      throw error;
    }
  },

  /**
   * Cria um novo agendamento
   */
  criar: async (dados) => {
    try {
      // Validação dos dados
      if (!dados.data_agendamento) {
        throw new Error('Data do agendamento é obrigatória');
      }

      if (!dados.carro_id) {
        throw new Error('Carro é obrigatório');
      }

      // Verifica se o carro existe
      const carro = await carroRepository.buscarPorId(dados.carro_id);
      if (!carro) {
        throw new Error('Carro não encontrado');
      }

      // Verifica se o usuário existe (se fornecido)
      if (dados.usuario_id) {
        const usuario = await usuarioRepository.buscarPorId(dados.usuario_id);
        if (!usuario) {
          throw new Error('Usuário não encontrado');
        }
      }

      // Verifica disponibilidade na data
      const disponivel = await agendamentoRepository.verificarDisponibilidade(
        dados.data_agendamento, 
        dados.carro_id
      );
      
      if (!disponivel) {
        throw new Error('Este carro já possui um agendamento para esta data');
      }

      // Validação de dados de contato quando não há usuário vinculado
      if (!dados.usuario_id) {
        if (!dados.nome_contato || !dados.email_contato || !dados.telefone_contato) {
          throw new Error('Para agendamentos sem usuário, os dados de contato são obrigatórios');
        }

        if (!validarEmail(dados.email_contato)) {
          throw new Error('E-mail de contato inválido');
        }
      }

      const id = await agendamentoRepository.inserir(dados);
      return { id, ...dados };
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
  },

  /**
   * Atualiza um agendamento existente
   */
  atualizar: async (id, dados) => {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }

      // Verifica se o agendamento existe
      const agendamentoExistente = await agendamentoRepository.buscarPorId(id);
      if (!agendamentoExistente) {
        throw new Error('Agendamento não encontrado');
      }

      // Se a data ou carro mudaram, verificar disponibilidade
      if (dados.data_agendamento && dados.carro_id && 
          (dados.data_agendamento !== agendamentoExistente.data_agendamento || 
           dados.carro_id !== agendamentoExistente.carro_id)) {
        
        const disponivel = await agendamentoRepository.verificarDisponibilidade(
          dados.data_agendamento, 
          dados.carro_id
        );
        
        if (!disponivel) {
          throw new Error('Este carro já possui um agendamento para esta data');
        }
      }

      return await agendamentoRepository.atualizar(id, dados);
    } catch (error) {
      console.error(`Erro ao atualizar agendamento ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Atualiza o status de um agendamento
   */
  atualizarStatus: async (id, status) => {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }

      // Valida status permitidos
      const statusPermitidos = ['pendente', 'confirmado', 'cancelado', 'concluido'];
      if (!statusPermitidos.includes(status)) {
        throw new Error('Status inválido');
      }

      // Verifica se o agendamento existe
      const agendamento = await agendamentoRepository.buscarPorId(id);
      if (!agendamento) {
        throw new Error('Agendamento não encontrado');
      }

      return await agendamentoRepository.atualizarStatus(id, status);
    } catch (error) {
      console.error(`Erro ao atualizar status do agendamento ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Confirma um agendamento
   */
  confirmar: async (id) => {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }

      // Verifica se o agendamento existe
      const agendamento = await agendamentoRepository.buscarPorId(id);
      if (!agendamento) {
        throw new Error('Agendamento não encontrado');
      }

      if (agendamento.status === 'confirmado') {
        return true; // Já está confirmado
      }

      if (agendamento.status === 'cancelado') {
        throw new Error('Não é possível confirmar um agendamento cancelado');
      }

      return await agendamentoRepository.confirmar(id);
    } catch (error) {
      console.error(`Erro ao confirmar agendamento ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cancela um agendamento
   */
  cancelar: async (id) => {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }

      // Verifica se o agendamento existe
      const agendamento = await agendamentoRepository.buscarPorId(id);
      if (!agendamento) {
        throw new Error('Agendamento não encontrado');
      }

      if (agendamento.status === 'cancelado') {
        return true; // Já está cancelado
      }

      if (agendamento.status === 'concluido') {
        throw new Error('Não é possível cancelar um agendamento concluído');
      }

      return await agendamentoRepository.cancelar(id);
    } catch (error) {
      console.error(`Erro ao cancelar agendamento ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deleta um agendamento
   */
  deletar: async (id) => {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }

      // Verifica se o agendamento existe
      const agendamento = await agendamentoRepository.buscarPorId(id);
      if (!agendamento) {
        throw new Error('Agendamento não encontrado');
      }

      return await agendamentoRepository.deletar(id);
    } catch (error) {
      console.error(`Erro ao deletar agendamento ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Verifica disponibilidade para agendamento
   */
  verificarDisponibilidade: async (data, carroId) => {
    try {
      if (!data) {
        throw new Error('Data não fornecida');
      }

      if (!carroId) {
        throw new Error('ID do carro não fornecido');
      }

      // Verifica se o carro existe
      const carro = await carroRepository.buscarPorId(carroId);
      if (!carro) {
        throw new Error('Carro não encontrado');
      }

      return await agendamentoRepository.verificarDisponibilidade(data, carroId);
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      throw error;
    }
  }
};

/**
 * Função auxiliar para validar email
 */
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}