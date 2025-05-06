import interesseRepository from '../repository/interesseRepository.js';
import carroRepository from '../repository/carroRepository.js';

export default {
  /**
   * Registra um novo interesse
   */
  registrarInteresse: async (interesse) => {
    try {
      // Validação dos dados
      validarDadosInteresse(interesse);
      
      // Verificar se o carro existe
      const carroId = interesse.carroId;
      const carro = await carroRepository.buscarPorId(carroId);
      
      if (!carro) {
        throw new Error('O carro especificado não existe');
      }
      
      // Sanitiza a mensagem para evitar mensagens muito longas
      if (interesse.mensagem) {
        interesse.mensagem = interesse.mensagem.substring(0, 1000);
      }
      
      // Registra o interesse
      return await interesseRepository.criar(interesse);
    } catch (error) {
      console.error('Erro no serviço ao registrar interesse:', error);
      throw error;
    }
  },

  /**
   * Lista todos os interesses
   */
  listarInteresses: async () => {
    try {
      return await interesseRepository.listar();
    } catch (error) {
      console.error('Erro no serviço ao listar interesses:', error);
      throw new Error('Não foi possível listar os interesses');
    }
  },

  /**
   * Busca um interesse por ID
   */
  buscarInteressePorId: async (id) => {
    if (!id) {
      throw new Error('ID não fornecido');
    }
    
    try {
      const interesse = await interesseRepository.buscarPorId(id);
      if (!interesse) {
        throw new Error('Interesse não encontrado');
      }
      return interesse;
    } catch (error) {
      console.error(`Erro no serviço ao buscar interesse ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Busca interesses por carro
   */
  buscarInteressesPorCarro: async (carroId) => {
    if (!carroId) {
      throw new Error('ID do carro não fornecido');
    }
    
    try {
      return await interesseRepository.buscarPorCarroId(carroId);
    } catch (error) {
      console.error(`Erro no serviço ao buscar interesses para o carro ID ${carroId}:`, error);
      throw new Error('Não foi possível buscar os interesses para este carro');
    }
  },

  /**
   * Busca interesses por email
   */
  buscarInteressesPorEmail: async (email) => {
    if (!email || !validarEmail(email)) {
      throw new Error('Email inválido');
    }
    
    try {
      return await interesseRepository.buscarPorEmail(email);
    } catch (error) {
      console.error('Erro no serviço ao buscar interesses por email:', error);
      throw new Error('Não foi possível buscar os interesses para este email');
    }
  },

  /**
   * Lista interesses não lidos
   */
  listarInteressesNaoLidos: async () => {
    try {
      return await interesseRepository.listarNaoLidos();
    } catch (error) {
      console.error('Erro no serviço ao listar interesses não lidos:', error);
      throw new Error('Não foi possível listar os interesses não lidos');
    }
  },

  /**
   * Conta interesses não lidos
   */
  contarInteressesNaoLidos: async () => {
    try {
      return await interesseRepository.contarNaoLidos();
    } catch (error) {
      console.error('Erro no serviço ao contar interesses não lidos:', error);
      throw new Error('Não foi possível contar os interesses não lidos');
    }
  },

  /**
   * Conta interesses por carro
   */
  contarInteressesPorCarro: async (carroId) => {
    if (!carroId) {
      throw new Error('ID do carro não fornecido');
    }
    
    try {
      return await interesseRepository.contarPorCarro(carroId);
    } catch (error) {
      console.error(`Erro no serviço ao contar interesses para o carro ID ${carroId}:`, error);
      throw new Error('Não foi possível contar os interesses para este carro');
    }
  },

  /**
   * Lista interesses por período
   */
  listarInteressesPorPeriodo: async (dataInicio, dataFim) => {
    try {
      // Validação das datas
      if (!dataInicio || !dataFim) {
        throw new Error('Data de início e fim são obrigatórias');
      }
      
      // Converte para objetos Date se forem strings
      const inicio = dataInicio instanceof Date ? dataInicio : new Date(dataInicio);
      const fim = dataFim instanceof Date ? dataFim : new Date(dataFim);
      
      if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
        throw new Error('Datas inválidas');
      }
      
      if (inicio > fim) {
        throw new Error('Data de início deve ser anterior à data de fim');
      }
      
      return await interesseRepository.listarPorPeriodo(inicio, fim);
    } catch (error) {
      console.error('Erro no serviço ao listar interesses por período:', error);
      throw error;
    }
  },

  /**
   * Marca um interesse como lido
   */
  marcarComoLido: async (id) => {
    if (!id) {
      throw new Error('ID não fornecido');
    }
    
    try {
      // Verificar se o interesse existe
      const interesse = await interesseRepository.buscarPorId(id);
      if (!interesse) {
        throw new Error('Interesse não encontrado');
      }
      
      // Se já estiver marcado como lido, retorna sucesso
      if (interesse.lido) {
        return true;
      }
      
      return await interesseRepository.marcarComoLido(id);
    } catch (error) {
      console.error(`Erro no serviço ao marcar interesse ID ${id} como lido:`, error);
      throw error;
    }
  },

  /**
   * Marca múltiplos interesses como lidos
   */
  marcarMultiplosComoLidos: async (ids) => {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new Error('Lista de IDs inválida');
    }
    
    try {
      return await interesseRepository.marcarMultiplosComoLido(ids);
    } catch (error) {
      console.error('Erro no serviço ao marcar múltiplos interesses como lidos:', error);
      throw error;
    }
  },

  /**
   * Exclui um interesse
   */
  excluirInteresse: async (id) => {
    if (!id) {
      throw new Error('ID não fornecido');
    }
    
    try {
      // Verificar se o interesse existe
      const interesse = await interesseRepository.buscarPorId(id);
      if (!interesse) {
        throw new Error('Interesse não encontrado');
      }
      
      return await interesseRepository.excluir(id);
    } catch (error) {
      console.error(`Erro no serviço ao excluir interesse ID ${id}:`, error);
      throw error;
    }
  }
};

/**
 * Funções auxiliares para validação
 */

function validarDadosInteresse(interesse) {
  if (!interesse) {
    throw new Error('Dados do interesse não fornecidos');
  }
  
  if (!interesse.nome || interesse.nome.trim().length < 3) {
    throw new Error('Nome é obrigatório e deve ter pelo menos 3 caracteres');
  }
  
  if (!interesse.email || !validarEmail(interesse.email)) {
    throw new Error('Email inválido');
  }
  
  if (!interesse.telefone || !validarTelefone(interesse.telefone)) {
    throw new Error('Telefone inválido');
  }
  
  if (!interesse.carroId) {
    throw new Error('ID do carro é obrigatório');
  }
}

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarTelefone(telefone) {
  // Aceita formatos como (99) 99999-9999 ou 99999999999
  const regex = /^(\(\d{2}\)\s?)?\d{4,5}-?\d{4}$/;
  return regex.test(telefone);
}