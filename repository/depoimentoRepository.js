import connection from '../config/database.js';

export default {
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
  
  buscarPorEmail: async (email) => {
    try {
      const [rows] = await connection.query(
        'SELECT * FROM depoimentos WHERE email = ? ORDER BY data DESC', 
        [email]
      );
      return rows;
    } catch (error) {
      console.error('Erro ao buscar depoimentos por email:', error);
      throw error;
    }
  },
  
  contarDepoimentos: async (apenasAprovados = null) => {
    try {
      let query = 'SELECT COUNT(*) as total FROM depoimentos';
      
      if (apenasAprovados === true) {
        query += ' WHERE aprovado = 1';
      }
      
      const [result] = await connection.query(query);
      return result[0].total;
    } catch (error) {
      console.error('Erro ao contar depoimentos:', error);
      throw error;
    }
  },
  
  buscarMaisRecentes: async (limite = 5) => {
    try {
      const [rows] = await connection.query(
        'SELECT * FROM depoimentos WHERE aprovado = 1 ORDER BY data DESC LIMIT ?',
        [limite]
      );
      return rows;
    } catch (error) {
      console.error('Erro ao buscar depoimentos recentes:', error);
      throw error;
    }
  },
  
  inserir: async (depoimento) => {
    try {
      const { nome_cliente, email, cidade, texto, avaliacao = 5, aprovado = false } = depoimento;
      
      const [result] = await connection.query(
        'INSERT INTO depoimentos (nome_cliente, email, cidade, texto, avaliacao, aprovado) VALUES (?, ?, ?, ?, ?, ?)',
        [nome_cliente, email, cidade || null, texto, avaliacao, aprovado]
      );
      
      return { 
        id: result.insertId,
        nome_cliente,
        email,
        cidade,
        texto,
        avaliacao,
        aprovado,
        data: new Date(),
        created_at: new Date()
      };
    } catch (error) {
      console.error('Erro ao criar depoimento:', error);
      throw error;
    }
  },
  
  atualizar: async (id, dados) => {
    try {
      const { nome_cliente, email, cidade, texto, avaliacao, aprovado } = dados;
      
      // Construir query dinâmica apenas com campos fornecidos
      const updateFields = [];
      const values = [];
      
      if (nome_cliente !== undefined) {
        updateFields.push('nome_cliente = ?');
        values.push(nome_cliente);
      }
      
      if (email !== undefined) {
        updateFields.push('email = ?');
        values.push(email);
      }
      
      if (cidade !== undefined) {
        updateFields.push('cidade = ?');
        values.push(cidade);
      }
      
      if (texto !== undefined) {
        updateFields.push('texto = ?');
        values.push(texto);
      }
      
      if (avaliacao !== undefined) {
        updateFields.push('avaliacao = ?');
        values.push(avaliacao);
      }
      
      if (aprovado !== undefined) {
        updateFields.push('aprovado = ?');
        values.push(aprovado);
      }
      
      if (updateFields.length === 0) {
        return { id };
      }
      
      values.push(id);
      
      await connection.query(
        `UPDATE depoimentos SET ${updateFields.join(', ')} WHERE id = ?`,
        values
      );
      
      return { id, ...dados };
    } catch (error) {
      console.error('Erro ao atualizar depoimento:', error);
      throw error;
    }
  },
  
  aprovar: async (id) => {
    try {
      await connection.query(
        'UPDATE depoimentos SET aprovado = true WHERE id = ?',
        [id]
      );
      return { id, aprovado: true };
    } catch (error) {
      console.error('Erro ao aprovar depoimento:', error);
      throw error;
    }
  },
  
  reprovar: async (id) => {
    try {
      await connection.query(
        'UPDATE depoimentos SET aprovado = false WHERE id = ?',
        [id]
      );
      return { id, aprovado: false };
    } catch (error) {
      console.error('Erro ao reprovar depoimento:', error);
      throw error;
    }
  },
  
  deletar: async (id) => {
    try {
      await connection.query('DELETE FROM depoimentos WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Erro ao excluir depoimento:', error);
      throw error;
    }
  }
};