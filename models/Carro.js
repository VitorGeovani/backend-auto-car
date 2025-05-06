import db from '../config/database.js';

const Carro = {
  buscarTodos: (callback) => {
    const sql = 'SELECT * FROM carros WHERE ativo = TRUE';
    db.query(sql, callback);
  },

  buscarPorId: (id, callback) => {
    const sql = 'SELECT * FROM carros WHERE id = ?';
    db.query(sql, [id], callback);
  },

  buscarComImagens: (callback) => {
    const sql = `
      SELECT c.*, GROUP_CONCAT(i.url) as imagens 
      FROM carros c
      LEFT JOIN imagens i ON c.id = i.carro_id
      WHERE c.ativo = TRUE
      GROUP BY c.id
    `;
    db.query(sql, callback);
  },

  buscarPorFiltros: (filtros, callback) => {
    let sql = 'SELECT * FROM carros WHERE ativo = TRUE';
    const params = [];

    if (filtros.marca) {
      sql += ' AND marca = ?';
      params.push(filtros.marca);
    }

    if (filtros.modelo) {
      sql += ' AND modelo LIKE ?';
      params.push(`%${filtros.modelo}%`);
    }

    if (filtros.anoMin) {
      sql += ' AND ano >= ?';
      params.push(filtros.anoMin);
    }

    if (filtros.anoMax) {
      sql += ' AND ano <= ?';
      params.push(filtros.anoMax);
    }

    if (filtros.precoMin) {
      sql += ' AND preco >= ?';
      params.push(filtros.precoMin);
    }

    if (filtros.precoMax) {
      sql += ' AND preco <= ?';
      params.push(filtros.precoMax);
    }

    if (filtros.categoria_id) {
      sql += ' AND categoria_id = ?';
      params.push(filtros.categoria_id);
    }

    db.query(sql, params, callback);
  },

  criar: (carro, callback) => {
    const sql = `INSERT INTO carros (
      marca, modelo, ano, quilometragem, cores, transmissao, combustivel,
      opcionais, preco, descricao, categoria_id, ativo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, [
      carro.marca, 
      carro.modelo, 
      carro.ano, 
      carro.quilometragem,
      carro.cores || null,
      carro.transmissao || 'manual',
      carro.combustivel || 'flex',
      carro.opcionais || null,
      carro.preco,
      carro.descricao || null,
      carro.categoria_id || null,
      carro.ativo !== undefined ? carro.ativo : true
    ], callback);
  },

  atualizar: (id, carro, callback) => {
    const sql = `UPDATE carros SET
      marca = ?,
      modelo = ?,
      ano = ?,
      quilometragem = ?,
      cores = ?,
      transmissao = ?,
      combustivel = ?,
      opcionais = ?,
      preco = ?,
      descricao = ?,
      categoria_id = ?,
      ativo = ?,
      updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`;
    
    db.query(sql, [
      carro.marca,
      carro.modelo,
      carro.ano,
      carro.quilometragem,
      carro.cores || null,
      carro.transmissao || 'manual',
      carro.combustivel || 'flex',
      carro.opcionais || null,
      carro.preco,
      carro.descricao || null,
      carro.categoria_id || null,
      carro.ativo !== undefined ? carro.ativo : true,
      id
    ], callback);
  },

  desativar: (id, callback) => {
    const sql = 'UPDATE carros SET ativo = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.query(sql, [id], callback);
  },

  deletar: (id, callback) => {
    const sql = 'DELETE FROM carros WHERE id = ?';
    db.query(sql, [id], callback);
  }
};

export default Carro;