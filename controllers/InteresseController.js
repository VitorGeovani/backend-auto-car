import Interesse from "../models/Interesse.js";

const InteresseController = {
  listar: async (req, res) => {
    try {
      const interesses = await Interesse.listar();
      res.json(interesses);
    } catch (error) {
      console.error("Erro ao listar interesses:", error);
      res.status(500).json({ erro: "Erro interno ao listar interesses" });
    }
  },

  obterPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const interesse = await Interesse.buscarPorId(id);

      if (!interesse) {
        return res.status(404).json({ erro: "Interesse não encontrado" });
      }

      res.json(interesse);
    } catch (error) {
      console.error("Erro ao obter interesse:", error);
      res.status(500).json({ erro: "Erro interno ao obter interesse" });
    }
  },

  criar: async (req, res) => {
    try {
      const { nome, email, telefone, mensagem, carroId } = req.body;

      // Validação básica
      if (!nome || !email || !telefone || !carroId) {
        return res.status(400).json({
          erro: "Dados incompletos. Nome, email, telefone e ID do carro são obrigatórios.",
        });
      }

      const resultado = await Interesse.criar({
        nome,
        email,
        telefone,
        mensagem: mensagem || `Interesse no veículo ID ${carroId}`,
        carroId,
      });

      res.status(201).json({
        mensagem: "Interesse registrado com sucesso",
        id: resultado.insertId,
      });
    } catch (error) {
      console.error("Erro ao criar interesse:", error);
      res.status(500).json({ erro: "Erro interno ao criar interesse" });
    }
  },

  marcarComoLido: async (req, res) => {
    try {
      const { id } = req.params;
      await Interesse.marcarComoLido(id);
      res.json({ mensagem: "Interesse marcado como lido" });
    } catch (error) {
      console.error("Erro ao marcar interesse como lido:", error);
      res
        .status(500)
        .json({ erro: "Erro interno ao marcar interesse como lido" });
    }
  },

  excluir: async (req, res) => {
    try {
      const { id } = req.params;
      await Interesse.excluir(id);
      res.json({ mensagem: "Interesse excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir interesse:", error);
      res.status(500).json({ erro: "Erro interno ao excluir interesse" });
    }
  },

  // Excluir todos os interesses de um carro
  excluirPorCarro: async (req, res) => {
    try {
      const { carroId } = req.params;

      // Obter todos os interesses para excluir
      const interesses = await Interesse.buscarPorCarroId(carroId);

      if (!interesses || interesses.length === 0) {
        return res.json({
          mensagem: "Nenhum interesse encontrado para este veículo",
          quantidadeExcluida: 0,
        });
      }

      // Excluir cada interesse individualmente para garantir consistência
      let excluidos = 0;
      for (const interesse of interesses) {
        await Interesse.excluir(interesse.id);
        excluidos++;
      }

      res.json({
        mensagem: `${excluidos} interesse(s) excluído(s) com sucesso`,
        quantidadeExcluida: excluidos,
      });
    } catch (error) {
      console.error("Erro ao excluir interesses por carro:", error);
      res.status(500).json({ erro: "Erro interno ao excluir interesses" });
    }
  }
};

export default InteresseController;
