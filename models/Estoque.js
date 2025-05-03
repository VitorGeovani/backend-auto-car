import db from '../config/database.js';

const Estoque = {
  buscarTodos: (callback) => {
    const sql = `
      SELECT e.*, c.modelo as modelo_carro 
      FROM estoque e
      JOIN carros c ON e.carro_id = c.id
    `;
    db.query(sql, callback);
  },

  criar: (estoque, callback) => {
    const sql = `INSERT INTO estoque (carro_id, quantidade, localizacao) 
                 VALUES (?, ?, ?)`;
    db.query(sql, [estoque.carro_id, estoque.quantidade, estoque.localizacao], callback);
  },

  atualizarQuantidade: (carroId, quantidade, callback) => {
    const sql = `UPDATE estoque SET quantidade = ? WHERE carro_id = ?`;
    db.query(sql, [quantidade, carroId], callback);
  }
};

export default Estoque;