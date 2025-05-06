import connection from '../config/database.js';

export default {
  buscarTodas: async () => {
    try {
      // Usando o padrão de promises com desestruturação correta
      const [categorias] = await connection.execute('SELECT * FROM categorias ORDER BY nome');
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
  
  buscarPorNome: async (nome) => {
    try {
      const [categorias] = await connection.execute('SELECT * FROM categorias WHERE nome = ?', [nome]);
      
      if (categorias.length === 0) {
        return null;
      }
      
      return categorias[0];
    } catch (error) {
      console.error('Erro ao buscar categoria por nome:', error);
      throw error;
    }
  },
  
  buscarComContagem: async () => {
    try {
      const [categorias] = await connection.execute(`
        SELECT c.*, COUNT(car.id) as total_carros
        FROM categorias c
        LEFT JOIN carros car ON c.id = car.categoria_id
        GROUP BY c.id
        ORDER BY c.nome
      `);
      return categorias;
    } catch (error) {
      console.error('Erro ao buscar categorias com contagem:', error);
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
      
      return { 
        id: result.insertId, 
        nome, 
        descricao,
        created_at: new Date(),
        updated_at: new Date()
      };
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
      
      return { 
        id: parseInt(id), 
        nome, 
        descricao,
        updated_at: new Date()
      };
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
  },
  
  verificarDependencias: async (id) => {
    try {
      const [resultado] = await connection.execute(
        'SELECT COUNT(*) as total FROM carros WHERE categoria_id = ?',
        [id]
      );
      return resultado[0].total > 0;
    } catch (error) {
      console.error('Erro ao verificar dependências da categoria:', error);
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