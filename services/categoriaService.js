import categoriaRepository from '../repository/categoriaRepository.js';

export default {
  /**
   * Lista todas as categorias
   */
  listar: async () => {
    try {
      return await categoriaRepository.buscarTodas();
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      throw new Error('Não foi possível listar as categorias');
    }
  },

  /**
   * Busca uma categoria por ID
   */
  buscarPorId: async (id) => {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }
      
      const categoria = await categoriaRepository.buscarPorId(id);
      
      if (!categoria) {
        throw new Error('Categoria não encontrada');
      }
      
      return categoria;
    } catch (error) {
      console.error(`Erro ao buscar categoria ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Busca uma categoria pelo nome
   */
  buscarPorNome: async (nome) => {
    try {
      if (!nome) {
        throw new Error('Nome não fornecido');
      }
      
      return await categoriaRepository.buscarPorNome(nome);
    } catch (error) {
      console.error(`Erro ao buscar categoria por nome "${nome}":`, error);
      throw error;
    }
  },

  /**
   * Lista categorias com contagem de carros
   */
  listarComContagem: async () => {
    try {
      return await categoriaRepository.buscarComContagem();
    } catch (error) {
      console.error('Erro ao listar categorias com contagem:', error);
      throw new Error('Não foi possível listar as categorias com contagem');
    }
  },

  /**
   * Cria uma nova categoria
   */
  criar: async (dados) => {
    try {
      // Validações
      if (!dados) {
        throw new Error('Dados não fornecidos');
      }
      
      if (!dados.nome) {
        throw new Error('Nome da categoria é obrigatório');
      }
      
      // Verificar se já existe categoria com este nome
      const categoriaExistente = await categoriaRepository.buscarPorNome(dados.nome);
      if (categoriaExistente) {
        throw new Error('Já existe uma categoria com este nome');
      }
      
      return await categoriaRepository.inserir(dados);
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  },

  /**
   * Atualiza uma categoria existente
   */
  atualizar: async (id, dados) => {
    try {
      // Validações
      if (!id) {
        throw new Error('ID não fornecido');
      }
      
      if (!dados) {
        throw new Error('Dados não fornecidos');
      }
      
      if (!dados.nome) {
        throw new Error('Nome da categoria é obrigatório');
      }
      
      // Verificar se a categoria existe
      const categoriaExistente = await categoriaRepository.buscarPorId(id);
      if (!categoriaExistente) {
        throw new Error('Categoria não encontrada');
      }
      
      // Se o nome foi alterado, verificar se já existe outra categoria com este nome
      if (dados.nome !== categoriaExistente.nome) {
        const categoriaComMesmoNome = await categoriaRepository.buscarPorNome(dados.nome);
        if (categoriaComMesmoNome && categoriaComMesmoNome.id !== parseInt(id)) {
          throw new Error('Já existe outra categoria com este nome');
        }
      }
      
      return await categoriaRepository.atualizar(id, dados);
    } catch (error) {
      console.error(`Erro ao atualizar categoria ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Verifica se uma categoria possui carros associados
   */
  verificarDependencias: async (id) => {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }
      
      return await categoriaRepository.verificarDependencias(id);
    } catch (error) {
      console.error(`Erro ao verificar dependências da categoria ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Exclui uma categoria se não possuir dependências
   */
  deletar: async (id) => {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }
      
      // Verificar se a categoria existe
      const categoriaExistente = await categoriaRepository.buscarPorId(id);
      if (!categoriaExistente) {
        throw new Error('Categoria não encontrada');
      }
      
      // Verificar se existem carros associados a esta categoria
      const possuiDependencias = await categoriaRepository.verificarDependencias(id);
      if (possuiDependencias) {
        throw new Error('Não é possível excluir esta categoria porque existem carros associados a ela');
      }
      
      return await categoriaRepository.deletar(id);
    } catch (error) {
      console.error(`Erro ao deletar categoria ID ${id}:`, error);
      throw error;
    }
  }
};