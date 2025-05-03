import db from '../config/database.js';

const Venda = {
  buscarTodas: (callback) => {
    const sql = `
      SELECT v.*, u.nome as nome_usuario, c.modelo as modelo_carro
      FROM vendas v
      JOIN usuarios u ON v.usuario_id = u.id
      JOIN carros c ON v.carro_id = c.id
    `;
    db.query(sql, callback);
  },

  registrar: (venda, callback) => {
    const sql = `
      INSERT INTO vendas (data_venda, valor_final, usuario_id, carro_id) 
      VALUES (?, ?, ?, ?)`;
    db.query(sql, [
      venda.data_venda,
      venda.valor_final,
      venda.usuario_id,
      venda.carro_id
    ], callback);
  }
};

export default Venda;