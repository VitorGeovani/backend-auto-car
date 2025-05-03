import connection from '../config/database.js';

export default {
  buscarTodas: async () => {
    try {
      // Corrigido: Usar promise no lugar de callback
      const [categorias] = await connection.execute('SELECT * FROM categorias');
      return categorias;
    } catch (error) {
      console.error('Erro ao buscar todas as categorias:', error);
      throw error;
    }
  },

  buscarPorId: async (id) => {
    try {
      const [categorias] = await connection.execute('SELECT * FROM categorias WHERE id = ?', [id]);
      
      if (categorias.length === 0) {
        return null;
      }
      
      return categorias[0];
    } catch (error) {
      console.error('Erro ao buscar categoria por ID:', error);
      throw error;
    }
  },

  inserir: async (dados) => {
    try {
      const { nome, descricao = '' } = dados;
      
      const [result] = await connection.execute(
        'INSERT INTO categorias (nome, descricao) VALUES (?, ?)', 
        [nome, descricao]
      );
      
      return { id: result.insertId, nome, descricao };
    } catch (error) {
      console.error('Erro ao inserir categoria:', error);
      throw error;
    }
  },

  atualizar: async (id, dados) => {
    try {
      const { nome, descricao = '' } = dados;
      
      await connection.execute(
        'UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?',
        [nome, descricao, id]
      );
      
      return { id: parseInt(id), nome, descricao };
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
  },

  deletar: async (id) => {
    try {
      await connection.execute('DELETE FROM categorias WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      throw error;
    }
  }
};