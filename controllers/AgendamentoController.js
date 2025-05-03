import Agendamento from '../models/Agendamento.js';

const AgendamentoController = {
  listar: (req, res) => {
    Agendamento.buscarTodos((err, results) => {
      if (err) return res.status(500).json({ erro: err });
      res.json(results);
    });
  },

  agendar: (req, res) => {
    const { nome, email, telefone, mensagem, carroId, tipo } = req.body;
    
    // Verificar se é um interesse ou agendamento
    if (tipo === 'interesse') {
      // Formatar dados de interesse para o formato de agendamento
      // Usando um valor válido do ENUM, como 'P' para pendente
      const dadosFormatados = {
        data_agendamento: new Date(), // Data atual como data do interesse
        status: 'P', // Usar um valor válido do ENUM - 'P' para pendente
        observacoes: `INTERESSE: ${mensagem || `Cliente ${nome} (${telefone}) demonstrou interesse neste veículo.`}`,
        usuario_id: null, // Se não tiver usuário logado
        carro_id: carroId,
        nome_contato: nome,
        email_contato: email,
        telefone_contato: telefone
      };
      
      Agendamento.criar(dadosFormatados, (err, result) => {
        if (err) return res.status(500).json({ erro: err });
        res.status(201).json({ mensagem: 'Interesse registrado com sucesso', id: result.insertId });
      });
    } else {
      // Caso seja um agendamento normal
      Agendamento.criar(req.body, (err, result) => {
        if (err) return res.status(500).json({ erro: err });
        res.status(201).json({ mensagem: 'Agendamento realizado com sucesso', id: result.insertId });
      });
    }
  }
};

export default AgendamentoController;