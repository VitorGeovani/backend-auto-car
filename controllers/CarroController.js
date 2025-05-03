import carroService from '../services/carroService.js';

const CarroController = {
  listar: async (req, res) => {
    try {
      const carros = await carroService.listarTodos();
      res.status(200).json(carros);
    } catch (error) {
      console.error('Erro ao listar carros:', error);
      res.status(500).json({ mensagem: 'Erro ao listar carros' });
    }
  },

  buscar: async (req, res) => {
    try {
      const { id } = req.params;
      const carro = await carroService.buscarPorId(id);
      
      if (!carro) {
        return res.status(404).json({ mensagem: 'Carro não encontrado' });
      }
      
      res.status(200).json(carro);
    } catch (error) {
      console.error('Erro ao buscar carro:', error);
      res.status(500).json({ mensagem: 'Erro ao buscar carro' });
    }
  },

  criar: async (req, res) => {
    try {
      const carroData = req.body;
      
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
        categoria_id: carroData.categoria_id ? parseInt(carroData.categoria_id) : null
      };
      
      const novoCarro = await carroService.criar(dadosFormatados);
      
      res.status(201).json({ 
        mensagem: 'Carro criado com sucesso',
        id: novoCarro.id,
        carro: novoCarro
      });
    } catch (error) {
      console.error('Erro ao criar carro:', error);
      res.status(500).json({ mensagem: 'Erro ao criar carro' });
    }
  },

  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const carroData = req.body;
      
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
        categoria_id: carroData.categoria_id ? parseInt(carroData.categoria_id) : null
      };
      
      const carroAtualizado = await carroService.atualizar(id, dadosFormatados);
      
      res.status(200).json({ 
        mensagem: 'Carro atualizado com sucesso',
        carro: carroAtualizado
      });
    } catch (error) {
      console.error('Erro ao atualizar carro:', error);
      res.status(500).json({ mensagem: 'Erro ao atualizar carro' });
    }
  },

  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      await carroService.deletar(id);
      
      res.status(200).json({ mensagem: 'Carro deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar carro:', error);
      res.status(500).json({ mensagem: 'Erro ao deletar carro' });
    }
  }
};

export default CarroController;