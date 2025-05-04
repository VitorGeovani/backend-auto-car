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
    return await carroRepository.buscarPorId(id);
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

const criar = async (carroData) => {
  try {
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

const deletar = async (id) => {
  try {
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
  criar,
  atualizar,
  deletar
};