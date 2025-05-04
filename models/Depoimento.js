import connection from '../config/database.js';

const Depoimento = {
  buscarTodos: async (apenasAprovados = null) => {
    try {
      let query = 'SELECT * FROM depoimentos';
      
      if (apenasAprovados === true) {
        query += ' WHERE aprovado = 1';
      }
      
      query += ' ORDER BY data DESC';
      
      const [rows] = await connection.query(query);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar todos os depoimentos:', error);
      throw error;
    }
  },
  
  buscarPorId: async (id) => {
    try {
      const [rows] = await connection.query(
        'SELECT * FROM depoimentos WHERE id = ?', 
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar depoimento por ID:', error);
      throw error;
    }
  },
  
  criar: async (depoimento) => {
    try {
      const { nome_cliente, email, cidade, texto, avaliacao, aprovado, data } = depoimento;
      
      const [result] = await connection.query(
        'INSERT INTO depoimentos (nome_cliente, email, cidade, texto, avaliacao, aprovado, data) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nome_cliente, email, cidade, texto, avaliacao, aprovado, data]
      );
      
      return { insertId: result.insertId };
    } catch (error) {
      console.error('Erro ao criar depoimento:', error);
      throw error;
    }
  },
  
  atualizar: async (id, dados) => {
    try {
      const { aprovado } = dados;
      
      await connection.query(
        'UPDATE depoimentos SET aprovado = ? WHERE id = ?',
        [aprovado, id]
      );
      
      return { id, aprovado };
    } catch (error) {
      console.error('Erro ao atualizar depoimento:', error);
      throw error;
    }
  },
  
  excluir: async (id) => {
    try {
      await connection.query('DELETE FROM depoimentos WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Erro ao excluir depoimento:', error);
      throw error;
    }
  }
};

export default Depoimento;