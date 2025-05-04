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