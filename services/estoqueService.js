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
    if (!id) {
      return null; // Retorna null em vez de lançar erro
    }
    
    const item = await estoqueRepository.buscarPorId(id);
    return item; // Retorna o item ou null/undefined
  } catch (error) {
    console.error('Erro ao buscar item por ID:', error);
    return null; // Retorna null em caso de erro
  }
};

const buscarPorCarroId = async (carro_id) => {
  try {
    if (!carro_id) {
      return null; // Retorna null em vez de lançar erro
    }
    
    // Verificar se o carro existe, mas não lançar erro se não existir
    const carro = await carroService.buscarPorId(carro_id).catch(() => null);
    if (!carro) {
      return null; // Retorna null em vez de lançar erro
    }
    
    return await estoqueRepository.buscarPorCarroId(carro_id);
  } catch (error) {
    console.error('Erro ao buscar estoque por carro_id:', error);
    return null; // Retorna null em caso de erro
  }
};

/**
 * Lista apenas os carros disponíveis em estoque
 */
const listarDisponiveis = async () => {
  try {
    return await estoqueRepository.listarDisponiveis();
  } catch (error) {
    console.error('Erro ao listar carros disponíveis em estoque:', error);
    return []; // Retorna array vazio em vez de lançar erro
  }
};

const adicionar = async (itemData) => {
  try {
    if (!itemData.carro_id) {
      throw new Error('ID do carro é obrigatório');
    }
    
    // Verificar se o carro existe
    const carro = await carroService.buscarPorId(itemData.carro_id).catch(() => null);
    if (!carro) {
      throw new Error('Carro não encontrado');
    }
    
    // Verificar se já existe um registro de estoque para este carro
    const estoqueExistente = await estoqueRepository.buscarPorCarroId(itemData.carro_id);
    if (estoqueExistente) {
      // Atualizar o existente em vez de lançar erro
      return await estoqueRepository.atualizar(estoqueExistente.id, {
        quantidade: parseInt(itemData.quantidade) || 1,
        localizacao: itemData.localizacao || estoqueExistente.localizacao
      });
    }
    
    // Validar quantidade
    if (itemData.quantidade && itemData.quantidade < 0) {
      throw new Error('A quantidade não pode ser negativa');
    }
    
    return await estoqueRepository.adicionar(itemData);
  } catch (error) {
    console.error('Erro ao adicionar item ao estoque:', error);
    throw error;
  }
};

const atualizar = async (id, itemData) => {
  try {
    if (!id) {
      throw new Error('ID é obrigatório');
    }
    
    // Verificar se o item existe
    const item = await estoqueRepository.buscarPorId(id);
    
    // Se não existir, tentamos criar um novo registro baseado no carro_id se estiver disponível
    if (!item && itemData.carro_id) {
      console.log('Item de estoque não encontrado. Tentando criar um novo.');
      return await adicionar(itemData);
    } else if (!item) {
      throw new Error('Item de estoque não encontrado');
    }
    
    // Validar quantidade
    if (itemData.quantidade !== undefined && itemData.quantidade < 0) {
      throw new Error('A quantidade não pode ser negativa');
    }
    
    return await estoqueRepository.atualizar(id, itemData);
  } catch (error) {
    console.error('Erro ao atualizar item do estoque:', error);
    throw error;
  }
};

/**
 * Atualiza apenas a quantidade de um item no estoque
 */
const atualizarQuantidade = async (carroId, quantidade) => {
  try {
    if (!carroId) {
      throw new Error('ID do carro é obrigatório');
    }
    
    if (quantidade === undefined) {
      throw new Error('Quantidade é obrigatória');
    }
    
    if (quantidade < 0) {
      throw new Error('A quantidade não pode ser negativa');
    }
    
    // Verificar se existe estoque para este carro
    const estoqueExistente = await estoqueRepository.buscarPorCarroId(carroId);
    
    // Se não existir registro, tentamos criar um novo
    if (!estoqueExistente) {
      console.log('Registro de estoque não encontrado para o carro. Criando novo registro.');
      return await adicionar({
        carro_id: carroId,
        quantidade: quantidade,
        localizacao: 'Matriz'
      });
    }
    
    const resultado = await estoqueRepository.atualizarQuantidade(carroId, quantidade);
    if (!resultado) {
      throw new Error('Não foi possível atualizar a quantidade');
    }
    
    return { carroId, quantidade, sucesso: true };
  } catch (error) {
    console.error('Erro ao atualizar quantidade no estoque:', error);
    throw error;
  }
};

/**
 * Reduz a quantidade de um item no estoque (usado em vendas)
 */
const reduzirQuantidade = async (carroId, quantidade = 1) => {
  try {
    if (!carroId) {
      throw new Error('ID do carro é obrigatório');
    }
    
    if (quantidade <= 0) {
      throw new Error('A quantidade a reduzir deve ser maior que zero');
    }
    
    // Verificar se existe estoque para este carro
    const estoqueExistente = await estoqueRepository.buscarPorCarroId(carroId);
    if (!estoqueExistente) {
      throw new Error('Não existe registro de estoque para este carro');
    }
    
    // Verificar se há quantidade suficiente
    if (estoqueExistente.quantidade < quantidade) {
      throw new Error('Quantidade insuficiente em estoque');
    }
    
    const resultado = await estoqueRepository.reduzirQuantidade(carroId, quantidade);
    if (!resultado) {
      throw new Error('Não foi possível reduzir a quantidade');
    }
    
    return { 
      carroId, 
      quantidadeReduzida: quantidade, 
      novaQuantidade: estoqueExistente.quantidade - quantidade,
      sucesso: true 
    };
  } catch (error) {
    console.error('Erro ao reduzir quantidade no estoque:', error);
    throw error;
  }
};

/**
 * Aumenta a quantidade de um item no estoque (usado em reposição)
 */
const aumentarQuantidade = async (carroId, quantidade = 1) => {
  try {
    if (!carroId) {
      throw new Error('ID do carro é obrigatório');
    }
    
    if (quantidade <= 0) {
      throw new Error('A quantidade a aumentar deve ser maior que zero');
    }
    
    // Verificar se existe estoque para este carro
    const estoqueExistente = await estoqueRepository.buscarPorCarroId(carroId);
    
    // Se não existir, criamos um novo registro
    if (!estoqueExistente) {
      return await adicionar({
        carro_id: carroId,
        quantidade: quantidade,
        localizacao: 'Matriz'
      });
    }
    
    const resultado = await estoqueRepository.aumentarQuantidade(carroId, quantidade);
    if (!resultado) {
      throw new Error('Não foi possível aumentar a quantidade');
    }
    
    return { 
      carroId, 
      quantidadeAumentada: quantidade, 
      novaQuantidade: estoqueExistente.quantidade + quantidade,
      sucesso: true 
    };
  } catch (error) {
    console.error('Erro ao aumentar quantidade no estoque:', error);
    throw error;
  }
};

/**
 * Verifica disponibilidade de um item no estoque
 */
const verificarDisponibilidade = async (carroId, quantidadeNecessaria = 1) => {
  try {
    if (!carroId) {
      return false; // Se não tiver ID, não está disponível
    }
    
    if (quantidadeNecessaria <= 0) {
      return true; // Se não precisar de quantidade, está "disponível"
    }
    
    // Ver se existe o item e verificar disponibilidade
    const estoqueItem = await estoqueRepository.buscarPorCarroId(carroId);
    if (!estoqueItem) {
      return false; // Se não existir no estoque, não está disponível
    }
    
    return estoqueItem.quantidade >= quantidadeNecessaria;
  } catch (error) {
    console.error('Erro ao verificar disponibilidade no estoque:', error);
    return false; // Em caso de erro, considerar como não disponível
  }
};

const deletar = async (id) => {
  try {
    if (!id) {
      throw new Error('ID é obrigatório');
    }
    
    // Verificar se o item existe
    const item = await estoqueRepository.buscarPorId(id);
    if (!item) {
      // Se não existir, apenas retorna sucesso sem fazer nada
      return { sucesso: true, mensagem: 'Item já não existe no estoque' };
    }
    
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
      const estoqueExistente = await estoqueRepository.buscarPorCarroId(carro.id);
      
      if (!estoqueExistente) {
        // Se não tem estoque, criar um novo
        await estoqueRepository.adicionar({
          carro_id: carro.id,
          quantidade: 1,
          localizacao: 'Matriz'
        });
        adicionados++;
      } else if (estoqueExistente.quantidade <= 0) {
        // Se tem estoque mas quantidade é zero, atualizar
        await estoqueRepository.atualizar(estoqueExistente.id, {
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
  listarDisponiveis,
  adicionar,
  atualizar,
  atualizarQuantidade,
  reduzirQuantidade,
  aumentarQuantidade,
  verificarDisponibilidade,
  deletar,
  revalidarEstoque
};