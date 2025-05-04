import carroService from '../services/carroService.js';
import imagemService from '../services/imagemService.js';

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
      
      // Aguardar um momento para garantir que o banco processou a atualização
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Buscar o carro atualizado para confirmar e incluir imagens
      const carroConfirmado = await carroService.buscarPorId(id);
      
      // Se temos o carro confirmado, buscar suas imagens
      if (carroConfirmado) {
        try {
          const imagens = await imagemService.buscarPorCarroId(id);
          carroConfirmado.imagens = imagens.map(img => img.url || img.caminho);
        } catch (imagemError) {
          console.error(`Erro ao buscar imagens para carro atualizado ${id}:`, imagemError);
          carroConfirmado.imagens = [];
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
      await carroService.deletar(id);
      
      res.status(200).json({ mensagem: 'Carro deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar carro:', error);
      res.status(500).json({ mensagem: 'Erro ao deletar carro', erro: error.message });
    }
  }
};

export default CarroController;