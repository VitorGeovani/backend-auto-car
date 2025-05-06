import db from '../config/database.js';

const Imagem = {
  buscarTodas: (callback) => {
    const sql = 'SELECT i.*, c.marca, c.modelo FROM imagens i JOIN carros c ON i.carro_id = c.id ORDER BY i.created_at DESC';
    db.query(sql, callback);
  },
  
  buscarPorId: (id, callback) => {
    const sql = 'SELECT * FROM imagens WHERE id = ?';
    db.query(sql, [id], callback);
  },

  buscarPorCarro: (carroId, callback) => {
    const sql = 'SELECT * FROM imagens WHERE carro_id = ? ORDER BY created_at DESC';
    db.query(sql, [carroId], callback);
  },

  contarPorCarro: (carroId, callback) => {
    const sql = 'SELECT COUNT(*) as total FROM imagens WHERE carro_id = ?';
    db.query(sql, [carroId], callback);
  },

  criar: (imagem, callback) => {
    const sql = 'INSERT INTO imagens (url, carro_id) VALUES (?, ?)';
    db.query(sql, [imagem.url, imagem.carro_id], callback);
  },
  
  criarMultiplas: (imagens, callback) => {
    if (!imagens || imagens.length === 0) {
      return callback(null, { affectedRows: 0 });
    }
    
    const values = imagens.map(img => [img.url, img.carro_id]);
    const sql = 'INSERT INTO imagens (url, carro_id) VALUES ?';
    db.query(sql, [values], callback);
  },

  atualizar: (id, url, callback) => {
    const sql = 'UPDATE imagens SET url = ? WHERE id = ?';
    db.query(sql, [url, id], callback);
  },

  deletarPorId: (id, callback) => {
    const sql = 'DELETE FROM imagens WHERE id = ?';
    db.query(sql, [id], callback);
  },
  
  deletarPorCarro: (carroId, callback) => {
    const sql = 'DELETE FROM imagens WHERE carro_id = ?';
    db.query(sql, [carroId], callback);
  }
};

export default Imagem;