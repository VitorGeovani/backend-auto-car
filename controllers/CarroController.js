import carroService from '../services/carroService.js';
import imagemService from '../services/imagemService.js';
import estoqueService from '../services/estoqueService.js'; // Nova importação necessária
import estoqueRepository from '../repository/estoqueRepository.js'; // Para operações diretas com o repositório

const CarroController = {
  listar: async (req, res) => {
    try {
      const carros = await carroService.listarTodos();
      
      // Buscar imagens para cada carro
      for (let carro of carros) {
        try {
          const imagens = await imagemService.buscarPorCarroId(carro.id);
          carro.imagens = imagens.map(img => img.url || img.caminho);
        } catch (imagemError) {
          console.error(`Erro ao buscar imagens para carro ${carro.id}:`, imagemError);
          carro.imagens = [];
        }
        
        // NOVO: Incluir informações de estoque na resposta
        try {
          const estoqueInfo = await estoqueRepository.buscarPorCarroId(carro.id);
          if (estoqueInfo) {
            carro.estoque = estoqueInfo;
          }
        } catch (estoqueError) {
          console.error(`Erro ao buscar estoque para carro ${carro.id}:`, estoqueError);
        }
      }
      
      res.status(200).json(carros);
    } catch (error) {
      console.error('Erro ao listar carros:', error);
      res.status(500).json({ mensagem: 'Erro ao listar carros', erro: error.message });
    }
  },

  buscar: async (req, res) => {
    try {
      const { id } = req.params;
      const carro = await carroService.buscarPorId(id);
      
      if (!carro) {
        return res.status(404).json({ mensagem: 'Carro não encontrado' });
      }
      
      // Buscar imagens do carro
      try {
        const imagens = await imagemService.buscarPorCarroId(carro.id);
        // Compatibilidade com ambos os formatos de campo (url ou caminho)
        carro.imagens = imagens.map(img => img.url || img.caminho);
      } catch (imagemError) {
        console.error(`Erro ao buscar imagens para carro ${id}:`, imagemError);
        carro.imagens = [];
      }
      
      // NOVO: Incluir informações de estoque na resposta
      try {
        const estoqueInfo = await estoqueRepository.buscarPorCarroId(carro.id);
        if (estoqueInfo) {
          carro.estoque = estoqueInfo;
        }
      } catch (estoqueError) {
        console.error(`Erro ao buscar estoque para carro ${id}:`, estoqueError);
      }
      
      res.status(200).json(carro);
    } catch (error) {
      console.error('Erro ao buscar carro:', error);
      res.status(500).json({ mensagem: 'Erro ao buscar carro', erro: error.message });
    }
  },

  criar: async (req, res) => {
    try {
      const carroData = req.body;
      console.log("Dados recebidos para criar carro:", carroData);
      
      // Extrair dados de estoque, se fornecidos
      const estoqueData = carroData.estoque || {};
      delete carroData.estoque; // Remover do objeto principal
      
      // Validando dados obrigatórios
      if (!carroData.modelo || !carroData.marca || !carroData.ano || !carroData.preco) {
        return res.status(400).json({ 
          mensagem: 'Dados incompletos. Modelo, marca, ano e preço são obrigatórios.' 
        });
      }
      
      // Garantindo que os tipos estão corretos
      const dadosFormatados = {
        ...carroData,
        ano: parseInt(carroData.ano),
        preco: parseFloat(carroData.preco),
        quilometragem: parseInt(carroData.quilometragem || 0),
        categoria_id: carroData.categoria_id ? parseInt(carroData.categoria_id) : null,
        ativo: true // Garantir que ativo seja true por padrão
      };
      
      const novoCarro = await carroService.criar(dadosFormatados);
      
      // NOVO: Criar estoque para o novo carro automaticamente
      if (novoCarro && novoCarro.id) {
        try {
          await estoqueRepository.adicionar({
            carro_id: novoCarro.id,
            quantidade: parseInt(estoqueData.quantidade) || 1,
            localizacao: estoqueData.localizacao || 'Matriz'
          });
          
          // Buscar o estoque recém-criado para incluir na resposta
          const estoqueInfo = await estoqueRepository.buscarPorCarroId(novoCarro.id);
          if (estoqueInfo) {
            novoCarro.estoque = estoqueInfo;
          }
        } catch (estoqueError) {
          console.error(`Erro ao criar estoque para novo carro ${novoCarro.id}:`, estoqueError);
        }
      }
      
      res.status(201).json({ 
        mensagem: 'Carro criado com sucesso',
        id: novoCarro.id,
        carro: novoCarro
      });
    } catch (error) {
      console.error('Erro ao criar carro:', error);
      res.status(500).json({ mensagem: 'Erro ao criar carro', erro: error.message });
    }
  },

  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const carroData = req.body;
      
      console.log("Dados recebidos para atualização do carro ID", id, ":", carroData);
      
      // NOVO: Extrair dados de estoque, se fornecidos
      const estoqueData = carroData.estoque || {};
      delete carroData.estoque; // Remover do objeto principal para não interferir na atualização
      
      // Validando dados obrigatórios
      if (!carroData.modelo || !carroData.marca || !carroData.ano || !carroData.preco) {
        return res.status(400).json({ 
          mensagem: 'Dados incompletos. Modelo, marca, ano e preço são obrigatórios.' 
        });
      }
      
      // Garantindo que os tipos estão corretos
      const dadosFormatados = {
        ...carroData,
        ano: parseInt(carroData.ano),
        preco: parseFloat(carroData.preco),
        quilometragem: parseInt(carroData.quilometragem || 0),
        categoria_id: carroData.categoria_id ? parseInt(carroData.categoria_id) : null,
        ativo: true // Garantir que ativo seja sempre true na atualização
      };
      
      const carroAtualizado = await carroService.atualizar(id, dadosFormatados);
      
      // Aguardar um momento maior para garantir que o banco processou a atualização
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // NOVO: Atualizar ou criar estoque se dados foram fornecidos
      let estoqueAtualizado = null;
      if (Object.keys(estoqueData).length > 0) {
        try {
          console.log(`Processando dados de estoque para carro ${id}:`, estoqueData);
          
          // Verificar se já existe estoque para este carro
          const estoqueExistente = await estoqueRepository.buscarPorCarroId(id);
          
          if (estoqueExistente) {
            // Atualizar o estoque existente
            console.log(`Atualizando estoque existente ID ${estoqueExistente.id}`);
            estoqueAtualizado = await estoqueRepository.atualizar(estoqueExistente.id, {
              quantidade: parseInt(estoqueData.quantidade) || estoqueExistente.quantidade || 1,
              localizacao: estoqueData.localizacao || estoqueExistente.localizacao || 'Matriz'
            });
            console.log('Estoque atualizado com sucesso:', estoqueAtualizado);
          } else {
            // Criar novo registro de estoque
            console.log('Criando novo registro de estoque para o carro');
            estoqueAtualizado = await estoqueRepository.adicionar({
              carro_id: parseInt(id),
              quantidade: parseInt(estoqueData.quantidade) || 1,
              localizacao: estoqueData.localizacao || 'Matriz'
            });
            console.log('Novo estoque criado com sucesso:', estoqueAtualizado);
          }
        } catch (estoqueError) {
          console.error(`Erro ao processar estoque para carro ${id}:`, estoqueError);
          // Não falhar a operação principal, apenas logar o erro
        }
        
        // Pequena pausa após operações de estoque para garantir consistência
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Buscar o carro atualizado para confirmar e incluir imagens
      const carroConfirmado = await carroService.buscarPorId(id);
      
      // Buscar imagens e estoque para incluir na resposta
      if (carroConfirmado) {
        try {
          const imagens = await imagemService.buscarPorCarroId(id);
          carroConfirmado.imagens = imagens.map(img => img.url || img.caminho);
        } catch (imagemError) {
          console.error(`Erro ao buscar imagens para carro atualizado ${id}:`, imagemError);
          carroConfirmado.imagens = [];
        }
        
        // NOVO: Adicionar informações de estoque à resposta
        try {
          // Usar o estoque atualizado se disponível, senão buscar novamente
          if (estoqueAtualizado) {
            carroConfirmado.estoque = estoqueAtualizado;
          } else {
            const estoqueInfo = await estoqueRepository.buscarPorCarroId(id);
            if (estoqueInfo) {
              carroConfirmado.estoque = estoqueInfo;
            }
          }
        } catch (estoqueError) {
          console.error(`Erro ao buscar estoque para carro ${id}:`, estoqueError);
        }
      }
      
      res.status(200).json({ 
        mensagem: 'Carro atualizado com sucesso',
        carro: carroConfirmado || carroAtualizado
      });
    } catch (error) {
      console.error('Erro ao atualizar carro:', error);
      res.status(500).json({ mensagem: 'Erro ao atualizar carro', erro: error.message });
    }
  },

  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      
      // NOVO: Verificar e remover estoque antes de excluir o carro
      try {
        const estoqueItem = await estoqueRepository.buscarPorCarroId(id);
        if (estoqueItem) {
          await estoqueRepository.deletar(estoqueItem.id);
          console.log(`Estoque do carro ${id} removido com sucesso`);
        }
      } catch (estoqueError) {
        console.error(`Erro ao remover estoque do carro ${id}:`, estoqueError);
        // Não falhar a operação principal
      }
      
      await carroService.deletar(id);
      
      res.status(200).json({ mensagem: 'Carro deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar carro:', error);
      res.status(500).json({ mensagem: 'Erro ao deletar carro', erro: error.message });
    }
  }
};

export default CarroController;