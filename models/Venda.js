import db from '../config/database.js';

const Venda = {
  buscarTodas: (callback) => {
    const sql = `
      SELECT v.*, u.nome as nome_usuario, c.modelo as modelo_carro, c.marca as marca_carro
      FROM vendas v
      JOIN usuarios u ON v.usuario_id = u.id
      JOIN carros c ON v.carro_id = c.id
      ORDER BY v.data_venda DESC
    `;
    db.query(sql, callback);
  },
  
  buscarPorId: (id, callback) => {
    const sql = `
      SELECT v.*, u.nome as nome_usuario, c.modelo as modelo_carro, c.marca as marca_carro
      FROM vendas v
      JOIN usuarios u ON v.usuario_id = u.id
      JOIN carros c ON v.carro_id = c.id
      WHERE v.id = ?
    `;
    db.query(sql, [id], callback);
  },
  
  buscarPorUsuario: (usuarioId, callback) => {
    const sql = `
      SELECT v.*, c.modelo as modelo_carro, c.marca as marca_carro, c.ano
      FROM vendas v
      JOIN carros c ON v.carro_id = c.id
      WHERE v.usuario_id = ?
      ORDER BY v.data_venda DESC
    `;
    db.query(sql, [usuarioId], callback);
  },
  
  buscarPorCarro: (carroId, callback) => {
    const sql = `
      SELECT v.*, u.nome as nome_usuario
      FROM vendas v
      JOIN usuarios u ON v.usuario_id = u.id
      WHERE v.carro_id = ?
      ORDER BY v.data_venda DESC
    `;
    db.query(sql, [carroId], callback);
  },
  
  buscarPorPeriodo: (dataInicio, dataFim, callback) => {
    const sql = `
      SELECT v.*, u.nome as nome_usuario, c.modelo as modelo_carro, c.marca as marca_carro
      FROM vendas v
      JOIN usuarios u ON v.usuario_id = u.id
      JOIN carros c ON v.carro_id = c.id
      WHERE v.data_venda BETWEEN ? AND ?
      ORDER BY v.data_venda DESC
    `;
    db.query(sql, [dataInicio, dataFim], callback);
  },
  
  contarTotal: (callback) => {
    const sql = `SELECT COUNT(*) as total FROM vendas`;
    db.query(sql, callback);
  },
  
  somarValores: (callback) => {
    const sql = `SELECT SUM(valor_final) as total FROM vendas`;
    db.query(sql, callback);
  },
  
  calcularMediaVendas: (callback) => {
    const sql = `SELECT AVG(valor_final) as media FROM vendas`;
    db.query(sql, callback);
  },
  
  registrar: (venda, callback) => {
    const sql = `
      INSERT INTO vendas (data_venda, valor_final, usuario_id, carro_id) 
      VALUES (?, ?, ?, ?)`;
    db.query(sql, [
      venda.data_venda || new Date(),
      venda.valor_final,
      venda.usuario_id,
      venda.carro_id
    ], callback);
  },
  
  atualizar: (id, venda, callback) => {
    const sql = `
      UPDATE vendas
      SET valor_final = ?, usuario_id = ?, carro_id = ?
      WHERE id = ?
    `;
    db.query(sql, [
      venda.valor_final,
      venda.usuario_id,
      venda.carro_id,
      id
    ], callback);
  },
  
  excluir: (id, callback) => {
    const sql = `DELETE FROM vendas WHERE id = ?`;
    db.query(sql, [id], callback);
  }
};

export default Venda;