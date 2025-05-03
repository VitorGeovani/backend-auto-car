import imagemRepository from '../repository/imagemRepository.js';

const salvar = async (carro_id, url) => {
  try {
    return await imagemRepository.inserir(carro_id, url);
  } catch (error) {
    console.error('Erro ao salvar imagem:', error);
    throw error;
  }
};

const buscarPorCarroId = async (carro_id) => {
  try {
    return await imagemRepository.buscarPorCarroId(carro_id);
  } catch (error) {
    console.error('Erro ao buscar imagens por carro_id:', error);
    throw error;
  }
};

const buscarPorId = async (id) => {
  try {
    return await imagemRepository.buscarPorId(id);
  } catch (error) {
    console.error('Erro ao buscar imagem por ID:', error);
    throw error;
  }
};

const excluir = async (id) => {
  try {
    return await imagemRepository.excluir(id);
  } catch (error) {
    console.error('Erro ao excluir imagem:', error);
    throw error;
  }
};

// Novo método para excluir todas as imagens de um veículo
const excluirPorCarroId = async (carro_id) => {
  try {
    return await imagemRepository.excluirPorCarroId(carro_id);
  } catch (error) {
    console.error('Erro ao excluir imagens do veículo:', error);
    throw error;
  }
};

export default {
  salvar,
  buscarPorCarroId,
  buscarPorId,
  excluir,
  excluirPorCarroId
};