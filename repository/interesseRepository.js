import pool from '../config/database.js';

const criar = async (interesse) => {
  try {
    const sql = `
      INSERT INTO interesses (nome, email, telefone, mensagem, carro_id) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const [resultado] = await pool.query(sql, [
      interesse.nome,
      interesse.email,
      interesse.telefone,
      interesse.mensagem,
      interesse.carroId
    ]);
    
    return {
      id: resultado.insertId,
      ...interesse,
      data_registro: new Date()
    };
  } catch (error) {
    console.error('Erro ao criar interesse:', error);
    throw error;
  }
};

const listar = async () => {
  try {
    const sql = `
      SELECT i.*, c.marca, c.modelo, c.ano
      FROM interesses i
      JOIN carros c ON i.carro_id = c.id
      ORDER BY i.data_registro DESC
    `;
    const [interesses] = await pool.query(sql);
    return interesses;
  } catch (error) {
    console.error('Erro ao listar interesses:', error);
    throw error;
  }
};

const buscarPorId = async (id) => {
  try {
    const sql = `
      SELECT i.*, c.marca, c.modelo, c.ano, c.preco
      FROM interesses i
      JOIN carros c ON i.carro_id = c.id
      WHERE i.id = ?
    `;
    const [interesses] = await pool.query(sql, [id]);
    return interesses.length > 0 ? interesses[0] : null;
  } catch (error) {
    console.error('Erro ao buscar interesse por ID:', error);
    throw error;
  }
};

const buscarPorCarroId = async (carroId) => {
  try {
    const sql = `SELECT * FROM interesses WHERE carro_id = ?`;
    const [interesses] = await pool.query(sql, [carroId]);
    return interesses;
  } catch (error) {
    console.error('Erro ao buscar interesses por carro_id:', error);
    throw error;
  }
};

const buscarPorEmail = async (email) => {
  try {
    const sql = `
      SELECT i.*, c.marca, c.modelo, c.ano
      FROM interesses i
      JOIN carros c ON i.carro_id = c.id
      WHERE i.email = ?
      ORDER BY i.data_registro DESC
    `;
    const [interesses] = await pool.query(sql, [email]);
    return interesses;
  } catch (error) {
    console.error('Erro ao buscar interesses por email:', error);
    throw error;
  }
};

const listarNaoLidos = async () => {
  try {
    const sql = `
      SELECT i.*, c.marca, c.modelo, c.ano
      FROM interesses i
      JOIN carros c ON i.carro_id = c.id
      WHERE i.lido = FALSE
      ORDER BY i.data_registro DESC
    `;
    const [interesses] = await pool.query(sql);
    return interesses;
  } catch (error) {
    console.error('Erro ao listar interesses não lidos:', error);
    throw error;
  }
};

const contarNaoLidos = async () => {
  try {
    const sql = `SELECT COUNT(*) as total FROM interesses WHERE lido = FALSE`;
    const [resultado] = await pool.query(sql);
    return resultado[0].total;
  } catch (error) {
    console.error('Erro ao contar interesses não lidos:', error);
    throw error;
  }
};

const contarPorCarro = async (carroId) => {
  try {
    const sql = `SELECT COUNT(*) as total FROM interesses WHERE carro_id = ?`;
    const [resultado] = await pool.query(sql, [carroId]);
    return resultado[0].total;
  } catch (error) {
    console.error('Erro ao contar interesses por carro:', error);
    throw error;
  }
};

const listarPorPeriodo = async (dataInicio, dataFim) => {
  try {
    const sql = `
      SELECT i.*, c.marca, c.modelo, c.ano
      FROM interesses i
      JOIN carros c ON i.carro_id = c.id
      WHERE i.data_registro BETWEEN ? AND ?
      ORDER BY i.data_registro DESC
    `;
    const [interesses] = await pool.query(sql, [dataInicio, dataFim]);
    return interesses;
  } catch (error) {
    console.error('Erro ao listar interesses por período:', error);
    throw error;
  }
};

const marcarComoLido = async (id) => {
  try {
    const sql = `UPDATE interesses SET lido = TRUE WHERE id = ?`;
    const [resultado] = await pool.query(sql, [id]);
    return resultado.affectedRows > 0;
  } catch (error) {
    console.error('Erro ao marcar interesse como lido:', error);
    throw error;
  }
};

const marcarMultiplosComoLido = async (ids) => {
  if (!ids || !ids.length) return false;
  
  try {
    const sql = `UPDATE interesses SET lido = TRUE WHERE id IN (?)`;
    const [resultado] = await pool.query(sql, [ids]);
    return resultado.affectedRows > 0;
  } catch (error) {
    console.error('Erro ao marcar múltiplos interesses como lidos:', error);
    throw error;
  }
};

const excluir = async (id) => {
  try {
    const sql = `DELETE FROM interesses WHERE id = ?`;
    const [resultado] = await pool.query(sql, [id]);
    return resultado.affectedRows > 0;
  } catch (error) {
    console.error('Erro ao excluir interesse:', error);
    throw error;
  }
};

export default {
  criar,
  listar,
  buscarPorId,
  buscarPorCarroId,
  buscarPorEmail,
  listarNaoLidos,
  contarNaoLidos,
  contarPorCarro,
  listarPorPeriodo,
  marcarComoLido,
  marcarMultiplosComoLido,
  excluir
};