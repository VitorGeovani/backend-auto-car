import imagemRepository from '../repository/imagemRepository.js';
import carroRepository from '../repository/carroRepository.js';

/**
 * Salva uma nova imagem para um carro
 */
const salvar = async (carro_id, url) => {
  try {
    if (!carro_id) {
      throw new Error('ID do carro é obrigatório');
    }

    if (!url) {
      throw new Error('URL da imagem é obrigatória');
    }

    // Verificar se o carro existe
    const carro = await carroRepository.buscarPorId(carro_id).catch(() => null);
    if (!carro) {
      throw new Error('Carro não encontrado');
    }

    return await imagemRepository.inserir(carro_id, url);
  } catch (error) {
    console.error('Erro ao salvar imagem:', error);
    throw error;
  }
};

/**
 * Salva múltiplas imagens de uma vez
 */
const salvarMultiplas = async (imagens) => {
  try {
    if (!imagens || !Array.isArray(imagens) || imagens.length === 0) {
      throw new Error('Lista de imagens inválida');
    }

    // Validar cada imagem
    for (const img of imagens) {
      if (!img.carro_id) {
        throw new Error('ID do carro é obrigatório para todas as imagens');
      }
      if (!img.url) {
        throw new Error('URL é obrigatória para todas as imagens');
      }
    }

    return await imagemRepository.inserirMultiplas(imagens);
  } catch (error) {
    console.error('Erro ao salvar múltiplas imagens:', error);
    throw error;
  }
};

/**
 * Lista todas as imagens com informações do carro
 */
const listarTodas = async () => {
  try {
    return await imagemRepository.buscarTodas();
  } catch (error) {
    console.error('Erro ao listar todas as imagens:', error);
    throw error;
  }
};

/**
 * Busca imagens por ID do carro
 */
const buscarPorCarroId = async (carro_id) => {
  try {
    if (!carro_id) {
      throw new Error('ID do carro é obrigatório');
    }

    return await imagemRepository.buscarPorCarroId(carro_id);
  } catch (error) {
    console.error('Erro ao buscar imagens por carro_id:', error);
    throw error;
  }
};

/**
 * Busca imagem por ID
 */
const buscarPorId = async (id) => {
  try {
    if (!id) {
      throw new Error('ID da imagem é obrigatório');
    }

    const imagem = await imagemRepository.buscarPorId(id);
    if (!imagem) {
      throw new Error('Imagem não encontrada');
    }

    return imagem;
  } catch (error) {
    console.error('Erro ao buscar imagem por ID:', error);
    throw error;
  }
};

/**
 * Conta quantas imagens um carro possui
 */
const contarPorCarro = async (carro_id) => {
  try {
    if (!carro_id) {
      throw new Error('ID do carro é obrigatório');
    }

    return await imagemRepository.contarPorCarro(carro_id);
  } catch (error) {
    console.error('Erro ao contar imagens do carro:', error);
    throw error;
  }
};

/**
 * Atualiza a URL de uma imagem
 */
const atualizar = async (id, url) => {
  try {
    if (!id) {
      throw new Error('ID da imagem é obrigatório');
    }

    if (!url) {
      throw new Error('Nova URL é obrigatória');
    }

    // Verificar se a imagem existe
    const imagem = await imagemRepository.buscarPorId(id);
    if (!imagem) {
      throw new Error('Imagem não encontrada');
    }

    return await imagemRepository.atualizar(id, url);
  } catch (error) {
    console.error('Erro ao atualizar URL da imagem:', error);
    throw error;
  }
};

/**
 * Exclui uma imagem
 */
const excluir = async (id) => {
  try {
    if (!id) {
      throw new Error('ID da imagem é obrigatório');
    }

    // Verificar se a imagem existe
    const imagem = await imagemRepository.buscarPorId(id);
    if (!imagem) {
      throw new Error('Imagem não encontrada');
    }

    return await imagemRepository.excluir(id);
  } catch (error) {
    console.error('Erro ao excluir imagem:', error);
    throw error;
  }
};

/**
 * Exclui todas as imagens de um carro
 */
const excluirPorCarroId = async (carro_id) => {
  try {
    if (!carro_id) {
      throw new Error('ID do carro é obrigatório');
    }

    return await imagemRepository.excluirPorCarroId(carro_id);
  } catch (error) {
    console.error('Erro ao excluir imagens do veículo:', error);
    throw error;
  }
};

export default {
  salvar,
  salvarMultiplas,
  listarTodas,
  buscarPorCarroId,
  buscarPorId,
  contarPorCarro,
  atualizar,
  excluir,
  excluirPorCarroId
};