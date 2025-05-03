import Venda from '../models/Venda.js';

const VendaController = {
  listar: (req, res) => {
    Venda.buscarTodas((err, results) => {
      if (err) return res.status(500).json({ erro: err });
      res.json(results);
    });
  },

  registrar: (req, res) => {
    Venda.registrar(req.body, (err, result) => {
      if (err) return res.status(500).json({ erro: err });
      res.status(201).json({ mensagem: 'Venda registrada com sucesso', id: result.insertId });
    });
  }
};

export default VendaController;