import db from '../config/database.js';

const Imagem = {
  buscarPorCarro: (carroId, callback) => {
    const sql = 'SELECT * FROM imagens WHERE carro_id = ?';
    db.query(sql, [carroId], callback);
  },

  criar: (imagem, callback) => {
    const sql = 'INSERT INTO imagens (caminho, carro_id) VALUES (?, ?)';
    db.query(sql, [imagem.caminho, imagem.carro_id], callback);
  },

  deletarPorId: (id, callback) => {
    const sql = 'DELETE FROM imagens WHERE id = ?';
    db.query(sql, [id], callback);
  }
};

export default Imagem;