import connection from '../config/database.js';

export default {
  buscarTodos: async () => {
    try {
      // O objeto Execute que está sendo retornado não tem a estrutura esperada
      // Vamos extrair os dados diretamente da conexão
      const [rows] = await connection.query(`
        SELECT e.id, e.carro_id, e.quantidade, e.localizacao, 
               c.modelo as modelo_carro, c.marca, c.ano, c.preco
        FROM estoque e
        JOIN carros c ON e.carro_id = c.id
      `);
      
      return rows;
    } catch (error) {
      console.error('Erro ao buscar todos os itens de estoque:', error);
      throw error;
    }
  },

  buscarPorId: async (id) => {
    try {
      const [rows] = await connection.query(`
        SELECT e.id, e.carro_id, e.quantidade, e.localizacao, 
               c.modelo as modelo_carro, c.marca, c.ano, c.preco
        FROM estoque e
        JOIN carros c ON e.carro_id = c.id
        WHERE e.id = ?
      `, [id]);
      
      if (rows.length === 0) {
        return null;
      }
      
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar item de estoque por ID:', error);
      throw error;
    }
  },

  buscarPorCarroId: async (carroId) => {
    try {
      const [rows] = await connection.query(`
        SELECT * FROM estoque WHERE carro_id = ?
      `, [carroId]);
      
      if (rows.length === 0) {
        return null;
      }
      
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar item de estoque por carro ID:', error);
      throw error;
    }
  },

  inserir: async (dados) => {
    try {
      const { carro_id, quantidade, localizacao = '' } = dados;
      
      const [result] = await connection.query(`
        INSERT INTO estoque (carro_id, quantidade, localizacao)
        VALUES (?, ?, ?)
      `, [carro_id, quantidade, localizacao]);
      
      return { 
        id: result.insertId,
        carro_id, 
        quantidade, 
        localizacao
      };
    } catch (error) {
      console.error('Erro ao inserir item no estoque:', error);
      throw error;
    }
  },

  atualizar: async (id, dados) => {
    try {
      const { quantidade, localizacao = '' } = dados;
      
      await connection.query(`
        UPDATE estoque
        SET quantidade = ?, localizacao = ?
        WHERE id = ?
      `, [quantidade, localizacao, id]);
      
      return { id: parseInt(id), ...dados };
    } catch (error) {
      console.error('Erro ao atualizar item de estoque:', error);
      throw error;
    }
  },

  deletar: async (id) => {
    try {
      await connection.query(`DELETE FROM estoque WHERE id = ?`, [id]);
      return true;
    } catch (error) {
      console.error('Erro ao deletar item de estoque:', error);
      throw error;
    }
  }
};