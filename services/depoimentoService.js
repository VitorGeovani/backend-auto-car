import depoimentoRepository from '../repository/depoimentoRepository.js';

export default {
  /**
   * Lista todos os depoimentos, com opção de filtro
   */
  listarDepoimentos: async (apenasAprovados = null) => {
    try {
      return await depoimentoRepository.buscarTodos(apenasAprovados);
    } catch (error) {
      console.error('Erro no serviço ao listar depoimentos:', error);
      throw new Error('Não foi possível listar os depoimentos');
    }
  },

  /**
   * Busca um depoimento específico por ID
   */
  buscarDepoimentoPorId: async (id) => {
    if (!id) {
      throw new Error('ID não fornecido');
    }
    
    try {
      const depoimento = await depoimentoRepository.buscarPorId(id);
      if (!depoimento) {
        throw new Error('Depoimento não encontrado');
      }
      return depoimento;
    } catch (error) {
      console.error(`Erro no serviço ao buscar depoimento ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Busca depoimentos por email
   */
  buscarDepoimentosPorEmail: async (email) => {
    if (!email || !validarEmail(email)) {
      throw new Error('Email inválido');
    }
    
    try {
      return await depoimentoRepository.buscarPorEmail(email);
    } catch (error) {
      console.error('Erro no serviço ao buscar depoimentos por email:', error);
      throw new Error('Não foi possível buscar os depoimentos para este email');
    }
  },

  /**
   * Conta o total de depoimentos
   */
  contarDepoimentos: async (apenasAprovados = null) => {
    try {
      return await depoimentoRepository.contarDepoimentos(apenasAprovados);
    } catch (error) {
      console.error('Erro no serviço ao contar depoimentos:', error);
      throw new Error('Não foi possível contar os depoimentos');
    }
  },

  /**
   * Lista os depoimentos mais recentes aprovados
   */
  listarDepoimentosRecentes: async (limite = 5) => {
    try {
      // Garante que o limite seja um número válido
      const limiteNumerico = parseInt(limite);
      if (isNaN(limiteNumerico) || limiteNumerico <= 0) {
        throw new Error('Limite deve ser um número positivo');
      }
      
      return await depoimentoRepository.buscarMaisRecentes(limiteNumerico);
    } catch (error) {
      console.error('Erro no serviço ao listar depoimentos recentes:', error);
      throw error;
    }
  },

  /**
   * Cria um novo depoimento
   */
  criarDepoimento: async (depoimento) => {
    try {
      // Validação dos dados
      validarDadosDepoimento(depoimento);
      
      // Sanitização - limitando o tamanho do texto
      const depoimentoSanitizado = {
        ...depoimento,
        texto: depoimento.texto.substring(0, 1000), // Limita a 1000 caracteres
        aprovado: false // Um novo depoimento sempre começa como não aprovado
      };
      
      return await depoimentoRepository.inserir(depoimentoSanitizado);
    } catch (error) {
      console.error('Erro no serviço ao criar depoimento:', error);
      throw error;
    }
  },

  /**
   * Atualiza um depoimento existente
   */
  atualizarDepoimento: async (id, dados) => {
    if (!id) {
      throw new Error('ID não fornecido');
    }
    
    try {
      // Verificar se o depoimento existe
      const depoimentoExistente = await depoimentoRepository.buscarPorId(id);
      if (!depoimentoExistente) {
        throw new Error('Depoimento não encontrado');
      }
      
      // Sanitização de dados recebidos
      if (dados.texto) {
        dados.texto = dados.texto.substring(0, 1000); // Limita a 1000 caracteres
      }
      
      if (dados.avaliacao) {
        dados.avaliacao = Math.min(5, Math.max(1, parseInt(dados.avaliacao))); // Garante valor entre 1-5
      }
      
      return await depoimentoRepository.atualizar(id, dados);
    } catch (error) {
      console.error(`Erro no serviço ao atualizar depoimento ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Aprova um depoimento
   */
  aprovarDepoimento: async (id) => {
    if (!id) {
      throw new Error('ID não fornecido');
    }
    
    try {
      // Verificar se o depoimento existe
      const depoimento = await depoimentoRepository.buscarPorId(id);
      if (!depoimento) {
        throw new Error('Depoimento não encontrado');
      }
      
      return await depoimentoRepository.aprovar(id);
    } catch (error) {
      console.error(`Erro no serviço ao aprovar depoimento ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Reprova um depoimento
   */
  reprovarDepoimento: async (id) => {
    if (!id) {
      throw new Error('ID não fornecido');
    }
    
    try {
      // Verificar se o depoimento existe
      const depoimento = await depoimentoRepository.buscarPorId(id);
      if (!depoimento) {
        throw new Error('Depoimento não encontrado');
      }
      
      return await depoimentoRepository.reprovar(id);
    } catch (error) {
      console.error(`Erro no serviço ao reprovar depoimento ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Exclui um depoimento
   */
  excluirDepoimento: async (id) => {
    if (!id) {
      throw new Error('ID não fornecido');
    }
    
    try {
      // Verificar se o depoimento existe
      const depoimento = await depoimentoRepository.buscarPorId(id);
      if (!depoimento) {
        throw new Error('Depoimento não encontrado');
      }
      
      return await depoimentoRepository.deletar(id);
    } catch (error) {
      console.error(`Erro no serviço ao excluir depoimento ID ${id}:`, error);
      throw error;
    }
  }
};

/**
 * Funções auxiliares para validação
 */

function validarDadosDepoimento(depoimento) {
  if (!depoimento) {
    throw new Error('Dados do depoimento não fornecidos');
  }
  
  if (!depoimento.nome_cliente || depoimento.nome_cliente.trim().length < 3) {
    throw new Error('Nome do cliente é obrigatório e deve ter pelo menos 3 caracteres');
  }
  
  if (!depoimento.email || !validarEmail(depoimento.email)) {
    throw new Error('Email inválido');
  }
  
  if (!depoimento.texto || depoimento.texto.trim().length < 10) {
    throw new Error('O texto do depoimento é obrigatório e deve ter pelo menos 10 caracteres');
  }
  
  if (depoimento.avaliacao) {
    const avaliacao = parseInt(depoimento.avaliacao);
    if (isNaN(avaliacao) || avaliacao < 1 || avaliacao > 5) {
      throw new Error('A avaliação deve ser um número entre 1 e 5');
    }
  }
}

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}