import estoqueRepository from '../repository/estoqueRepository.js';
import carroRepository from '../repository/carroRepository.js';

export default {
  listarTodos: () => estoqueRepository.buscarTodos(),

  buscarPorId: (id) => estoqueRepository.buscarPorId(id),
  
  buscarPorCarroId: (carroId) => estoqueRepository.buscarPorCarroId(carroId),

  adicionar: async (dados) => {
    // Verificar se o carro existe antes de adicionar ao estoque
    const carro = await carroRepository.buscarPorId(dados.carro_id);
    if (!carro) {
      throw new Error(`Carro com ID ${dados.carro_id} não encontrado`);
    }
    
    return estoqueRepository.inserir(dados);
  },

  atualizar: async (id, dados) => {
    // Verificar se o item de estoque existe antes de atualizar
    const estoque = await estoqueRepository.buscarPorId(id);
    if (!estoque) {
      throw new Error(`Item de estoque com ID ${id} não encontrado`);
    }
    
    return estoqueRepository.atualizar(id, dados);
  },

  deletar: async (id) => {
    // Verificar se o item de estoque existe antes de deletar
    const estoque = await estoqueRepository.buscarPorId(id);
    if (!estoque) {
      throw new Error(`Item de estoque com ID ${id} não encontrado`);
    }
    
    return estoqueRepository.deletar(id);
  }
};