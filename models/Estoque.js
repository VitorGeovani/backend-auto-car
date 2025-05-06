import db from '../config/database.js';

const Estoque = {
  buscarTodos: (callback) => {
    const sql = `
      SELECT e.*, c.modelo as modelo_carro, c.marca as marca_carro
      FROM estoque e
      JOIN carros c ON e.carro_id = c.id
      ORDER BY e.updated_at DESC
    `;
    db.query(sql, callback);
  },
  
  buscarPorId: (id, callback) => {
    const sql = `
      SELECT e.*, c.modelo as modelo_carro, c.marca as marca_carro
      FROM estoque e
      JOIN carros c ON e.carro_id = c.id
      WHERE e.id = ?
    `;
    db.query(sql, [id], callback);
  },
  
  buscarPorCarroId: (carroId, callback) => {
    const sql = `
      SELECT e.*, c.modelo as modelo_carro, c.marca as marca_carro
      FROM estoque e
      JOIN carros c ON e.carro_id = c.id
      WHERE e.carro_id = ?
    `;
    db.query(sql, [carroId], callback);
  },
  
  buscarDisponiveis: (callback) => {
    const sql = `
      SELECT e.*, c.modelo as modelo_carro, c.marca as marca_carro
      FROM estoque e
      JOIN carros c ON e.carro_id = c.id
      WHERE e.quantidade > 0 AND c.ativo = TRUE
      ORDER BY c.marca, c.modelo
    `;
    db.query(sql, callback);
  },

  criar: (estoque, callback) => {
    const sql = `INSERT INTO estoque (carro_id, quantidade, localizacao) 
                 VALUES (?, ?, ?)`;
    db.query(sql, [
      estoque.carro_id, 
      estoque.quantidade || 1, 
      estoque.localizacao || 'Matriz'
    ], callback);
  },

  atualizar: (id, estoque, callback) => {
    const sql = `UPDATE estoque 
                 SET quantidade = ?, localizacao = ?
                 WHERE id = ?`;
    db.query(sql, [
      estoque.quantidade, 
      estoque.localizacao,
      id
    ], callback);
  },

  atualizarQuantidade: (carroId, quantidade, callback) => {
    const sql = `UPDATE estoque SET quantidade = ? WHERE carro_id = ?`;
    db.query(sql, [quantidade, carroId], callback);
  },
  
  reduzirQuantidade: (carroId, quantidade = 1, callback) => {
    const sql = `UPDATE estoque 
                 SET quantidade = quantidade - ? 
                 WHERE carro_id = ? AND quantidade >= ?`;
    db.query(sql, [quantidade, carroId, quantidade], callback);
  },
  
  aumentarQuantidade: (carroId, quantidade = 1, callback) => {
    const sql = `UPDATE estoque 
                 SET quantidade = quantidade + ? 
                 WHERE carro_id = ?`;
    db.query(sql, [quantidade, carroId], callback);
  },
  
  verificarDisponibilidade: (carroId, quantidadeNecessaria = 1, callback) => {
    const sql = `SELECT quantidade >= ? as disponivel 
                 FROM estoque 
                 WHERE carro_id = ?`;
    db.query(sql, [quantidadeNecessaria, carroId], callback);
  },
  
  deletar: (id, callback) => {
    const sql = `DELETE FROM estoque WHERE id = ?`;
    db.query(sql, [id], callback);
  }
};

export default Estoque;