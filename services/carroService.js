import carroRepository from '../repository/carroRepository.js';

const listarTodos = async () => {
  try {
    return await carroRepository.listarTodos();
  } catch (error) {
    console.error('Erro ao listar carros:', error);
    throw error;
  }
};

const buscarPorId = async (id) => {
  try {
    if (!id) {
      throw new Error('ID do carro é obrigatório');
    }
    
    const carro = await carroRepository.buscarPorId(id);
    if (!carro) {
      throw new Error('Carro não encontrado');
    }
    
    return carro;
  } catch (error) {
    console.error('Erro ao buscar carro por ID:', error);
    throw error;
  }
};

const listarAtivos = async () => {
  try {
    return await carroRepository.listarAtivos();
  } catch (error) {
    console.error('Erro ao listar carros ativos:', error);
    throw error;
  }
};

/**
 * Busca carros com suas imagens
 */
const buscarComImagens = async () => {
  try {
    return await carroRepository.buscarComImagens();
  } catch (error) {
    console.error('Erro ao buscar carros com imagens:', error);
    throw error;
  }
};

/**
 * Busca carros aplicando filtros
 */
const buscarPorFiltros = async (filtros) => {
  try {
    if (!filtros) {
      return await carroRepository.listarAtivos();
    }
    
    // Validação dos filtros numéricos
    const filtrosSanitizados = { ...filtros };
    
    if (filtros.anoMin) {
      filtrosSanitizados.anoMin = parseInt(filtros.anoMin);
      if (isNaN(filtrosSanitizados.anoMin)) {
        delete filtrosSanitizados.anoMin;
      }
    }
    
    if (filtros.anoMax) {
      filtrosSanitizados.anoMax = parseInt(filtros.anoMax);
      if (isNaN(filtrosSanitizados.anoMax)) {
        delete filtrosSanitizados.anoMax;
      }
    }
    
    if (filtros.precoMin) {
      filtrosSanitizados.precoMin = parseFloat(filtros.precoMin);
      if (isNaN(filtrosSanitizados.precoMin)) {
        delete filtrosSanitizados.precoMin;
      }
    }
    
    if (filtros.precoMax) {
      filtrosSanitizados.precoMax = parseFloat(filtros.precoMax);
      if (isNaN(filtrosSanitizados.precoMax)) {
        delete filtrosSanitizados.precoMax;
      }
    }
    
    if (filtros.categoria_id) {
      filtrosSanitizados.categoria_id = parseInt(filtros.categoria_id);
      if (isNaN(filtrosSanitizados.categoria_id)) {
        delete filtrosSanitizados.categoria_id;
      }
    }
    
    return await carroRepository.buscarPorFiltros(filtrosSanitizados);
  } catch (error) {
    console.error('Erro ao buscar carros com filtros:', error);
    throw error;
  }
};

const criar = async (carroData) => {
  try {
    // Validação dos dados obrigatórios
    if (!carroData.modelo) {
      throw new Error('Modelo do carro é obrigatório');
    }
    
    if (!carroData.marca) {
      throw new Error('Marca do carro é obrigatória');
    }
    
    if (!carroData.ano) {
      throw new Error('Ano do carro é obrigatório');
    }
    
    if (!carroData.preco) {
      throw new Error('Preço do carro é obrigatório');
    }
    
    // Garantir que o campo ativo esteja presente
    const dadosCompletos = {
      ...carroData,
      ativo: carroData.ativo !== undefined ? carroData.ativo : true
    };
    
    return await carroRepository.criar(dadosCompletos);
  } catch (error) {
    console.error('Erro ao criar carro:', error);
    throw error;
  }
};

const atualizar = async (id, carroData) => {
  try {
    if (!id) {
      throw new Error('ID do carro é obrigatório');
    }
    
    // Verificar se o carro existe
    const carroExistente = await carroRepository.buscarPorId(id);
    if (!carroExistente) {
      throw new Error('Carro não encontrado');
    }
    
    // Garantir que o campo ativo esteja presente
    const dadosCompletos = {
      ...carroData,
      ativo: carroData.ativo !== undefined ? carroData.ativo : true
    };
    
    return await carroRepository.atualizar(id, dadosCompletos);
  } catch (error) {
    console.error('Erro ao atualizar carro:', error);
    throw error;
  }
};

/**
 * Desativa um carro sem excluí-lo
 */
const desativar = async (id) => {
  try {
    if (!id) {
      throw new Error('ID do carro é obrigatório');
    }
    
    // Verificar se o carro existe
    const carroExistente = await carroRepository.buscarPorId(id);
    if (!carroExistente) {
      throw new Error('Carro não encontrado');
    }
    
    return await carroRepository.desativar(id);
  } catch (error) {
    console.error('Erro ao desativar carro:', error);
    throw error;
  }
};

const deletar = async (id) => {
  try {
    if (!id) {
      throw new Error('ID do carro é obrigatório');
    }
    
    // Verificar se o carro existe
    const carroExistente = await carroRepository.buscarPorId(id);
    if (!carroExistente) {
      throw new Error('Carro não encontrado');
    }
    
    return await carroRepository.deletar(id);
  } catch (error) {
    console.error('Erro ao deletar carro:', error);
    throw error;
  }
};

export default {
  listarTodos,
  buscarPorId,
  listarAtivos,
  buscarComImagens,
  buscarPorFiltros,
  criar,
  atualizar,
  desativar,
  deletar
};