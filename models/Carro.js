import db from '../config/database.js';

const Carro = {
  buscarTodos: (callback) => {
    const sql = 'SELECT * FROM carros';
    db.query(sql, callback);
  },

  buscarPorId: (id, callback) => {
    const sql = 'SELECT * FROM carros WHERE id = ?';
    db.query(sql, [id], callback);
  },

  criar: (carro, callback) => {
    const sql = `INSERT INTO carros (marca, modelo, ano, km, preco, descricao, categoria_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [
      carro.marca, carro.modelo, carro.ano, carro.km,
      carro.preco, carro.descricao, carro.categoria_id
    ], callback);
  },

  deletar: (id, callback) => {
    const sql = 'DELETE FROM carros WHERE id = ?';
    db.query(sql, [id], callback);
  }
};

export default Carro;