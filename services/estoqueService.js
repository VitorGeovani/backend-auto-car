import estoqueRepository from '../repository/estoqueRepository.js';
import carroService from './carroService.js';

const listarTodos = async () => {
  try {
    return await estoqueRepository.listarTodos();
  } catch (error) {
    console.error('Erro ao listar estoque:', error);
    throw error;
  }
};

const buscarPorId = async (id) => {
  try {
    return await estoqueRepository.buscarPorId(id);
  } catch (error) {
    console.error('Erro ao buscar item por ID:', error);
    throw error;
  }
};

const buscarPorCarroId = async (carro_id) => {
  try {
    return await estoqueRepository.buscarPorCarroId(carro_id);
  } catch (error) {
    console.error('Erro ao buscar estoque por carro_id:', error);
    throw error;
  }
};

const adicionar = async (itemData) => {
  try {
    return await estoqueRepository.adicionar(itemData);
  } catch (error) {
    console.error('Erro ao adicionar item ao estoque:', error);
    throw error;
  }
};

const atualizar = async (id, itemData) => {
  try {
    return await estoqueRepository.atualizar(id, itemData);
  } catch (error) {
    console.error('Erro ao atualizar item do estoque:', error);
    throw error;
  }
};

const deletar = async (id) => {
  try {
    return await estoqueRepository.deletar(id);
  } catch (error) {
    console.error('Erro ao deletar item do estoque:', error);
    throw error;
  }
};

// Nova função para revalidar estoque - criar itens para carros sem estoque
const revalidarEstoque = async () => {
  try {
    // Buscar todos os carros ativos
    const carros = await carroService.listarAtivos();
    let adicionados = 0;
    let atualizados = 0;
    
    // Para cada carro, verificar se tem estoque
    for (const carro of carros) {
      const estoqueExistente = await buscarPorCarroId(carro.id);
      
      if (!estoqueExistente) {
        // Se não tem estoque, criar um novo
        await adicionar({
          carro_id: carro.id,
          quantidade: 1,
          localizacao: 'Matriz'
        });
        adicionados++;
      } else if (estoqueExistente.quantidade <= 0) {
        // Se tem estoque mas quantidade é zero, atualizar
        await atualizar(estoqueExistente.id, {
          quantidade: 1,
          localizacao: estoqueExistente.localizacao || 'Matriz'
        });
        atualizados++;
      }
    }
    
    return { adicionados, atualizados, total: carros.length };
  } catch (error) {
    console.error('Erro ao revalidar estoque:', error);
    throw error;
  }
};

export default {
  listarTodos,
  buscarPorId,
  buscarPorCarroId,
  adicionar,
  atualizar,
  deletar,
  revalidarEstoque
};