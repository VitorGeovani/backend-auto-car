import db from '../config/database.js';

const Interesse = {
  criar: async (interesse) => {
    const sql = `INSERT INTO interesses 
      (nome, email, telefone, mensagem, carro_id) 
      VALUES (?, ?, ?, ?, ?)`;
    
    try {
      const [result] = await db.query(sql, [
        interesse.nome,
        interesse.email,
        interesse.telefone,
        interesse.mensagem,
        interesse.carroId
      ]);
      return result;
    } catch (error) {
      console.error('Erro ao criar interesse:', error);
      throw error;
    }
  },

  listar: async () => {
    const sql = `
      SELECT i.*, c.marca, c.modelo, c.ano
      FROM interesses i
      JOIN carros c ON i.carro_id = c.id
      ORDER BY i.data_registro DESC
    `;
    try {
      const [results] = await db.query(sql);
      return results;
    } catch (error) {
      console.error('Erro ao listar interesses:', error);
      throw error;
    }
  },

  buscarPorId: async (id) => {
    const sql = `
      SELECT i.*, c.marca, c.modelo, c.ano, c.preco
      FROM interesses i
      JOIN carros c ON i.carro_id = c.id
      WHERE i.id = ?
    `;
    try {
      const [rows] = await db.query(sql, [id]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar interesse por ID:', error);
      throw error;
    }
  },

  buscarPorCarroId: async (carroId) => {
    const sql = `SELECT * FROM interesses WHERE carro_id = ?`;
    try {
      const [rows] = await db.query(sql, [carroId]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar interesses por carro_id:', error);
      throw error;
    }
  },
  
  buscarPorEmail: async (email) => {
    const sql = `
      SELECT i.*, c.marca, c.modelo, c.ano
      FROM interesses i
      JOIN carros c ON i.carro_id = c.id
      WHERE i.email = ?
      ORDER BY i.data_registro DESC
    `;
    try {
      const [rows] = await db.query(sql, [email]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar interesses por email:', error);
      throw error;
    }
  },

  listarNaoLidos: async () => {
    const sql = `
      SELECT i.*, c.marca, c.modelo, c.ano
      FROM interesses i
      JOIN carros c ON i.carro_id = c.id
      WHERE i.lido = FALSE
      ORDER BY i.data_registro DESC
    `;
    try {
      const [results] = await db.query(sql);
      return results;
    } catch (error) {
      console.error('Erro ao listar interesses não lidos:', error);
      throw error;
    }
  },
  
  contarNaoLidos: async () => {
    const sql = `SELECT COUNT(*) as total FROM interesses WHERE lido = FALSE`;
    try {
      const [result] = await db.query(sql);
      return result[0].total;
    } catch (error) {
      console.error('Erro ao contar interesses não lidos:', error);
      throw error;
    }
  },

  contarPorCarro: async (carroId) => {
    const sql = `SELECT COUNT(*) as total FROM interesses WHERE carro_id = ?`;
    try {
      const [result] = await db.query(sql, [carroId]);
      return result[0].total;
    } catch (error) {
      console.error('Erro ao contar interesses por carro:', error);
      throw error;
    }
  },

  listarPorPeriodo: async (dataInicio, dataFim) => {
    const sql = `
      SELECT i.*, c.marca, c.modelo, c.ano
      FROM interesses i
      JOIN carros c ON i.carro_id = c.id
      WHERE i.data_registro BETWEEN ? AND ?
      ORDER BY i.data_registro DESC
    `;
    try {
      const [results] = await db.query(sql, [dataInicio, dataFim]);
      return results;
    } catch (error) {
      console.error('Erro ao listar interesses por período:', error);
      throw error;
    }
  },

  marcarComoLido: async (id) => {
    const sql = `UPDATE interesses SET lido = 1 WHERE id = ?`;
    try {
      await db.query(sql, [id]);
      return true;
    } catch (error) {
      console.error('Erro ao marcar interesse como lido:', error);
      throw error;
    }
  },
  
  marcarMultiplosComoLido: async (ids) => {
    if (!ids || !ids.length) return false;
    
    const sql = `UPDATE interesses SET lido = 1 WHERE id IN (?)`;
    try {
      await db.query(sql, [ids]);
      return true;
    } catch (error) {
      console.error('Erro ao marcar múltiplos interesses como lidos:', error);
      throw error;
    }
  },

  excluir: async (id) => {
    const sql = `DELETE FROM interesses WHERE id = ?`;
    try {
      await db.query(sql, [id]);
      return true;
    } catch (error) {
      console.error('Erro ao excluir interesse:', error);
      throw error;
    }
  }
};

export default Interesse;