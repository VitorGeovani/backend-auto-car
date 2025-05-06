import db from '../utils/db.js';

export default {
  buscarTodos: async (paginacao = null) => {
    try {
      let sql = 'SELECT id, nome, email, telefone, created_at FROM usuarios';
      
      if (paginacao) {
        const { limite = 10, pagina = 1 } = paginacao;
        const offset = (pagina - 1) * limite;
        sql += ` LIMIT ${limite} OFFSET ${offset}`;
      }
      
      const [linhas] = await db.query(sql);
      return linhas;
    } catch (error) {
      console.error('Erro ao buscar todos os usuários:', error);
      throw error;
    }
  },

  buscarPorId: async (id) => {
    try {
      // Não retorna a senha por segurança
      const [linhas] = await db.query(
        'SELECT id, nome, email, telefone, created_at FROM usuarios WHERE id = ?',
        [id]
      );
      return linhas.length > 0 ? linhas[0] : null;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      throw error;
    }
  },
  
  buscarPorEmail: async (email) => {
    try {
      const [linhas] = await db.query(
        'SELECT * FROM usuarios WHERE email = ?', 
        [email]
      );
      return linhas.length > 0 ? linhas[0] : null;
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw error;
    }
  },
  
  buscarPorNome: async (nome) => {
    try {
      const [linhas] = await db.query(
        'SELECT id, nome, email, telefone, created_at FROM usuarios WHERE nome LIKE ?',
        [`%${nome}%`]
      );
      return linhas;
    } catch (error) {
      console.error('Erro ao buscar usuários por nome:', error);
      throw error;
    }
  },
  
  contar: async () => {
    try {
      const [result] = await db.query('SELECT COUNT(*) as total FROM usuarios');
      return result[0].total;
    } catch (error) {
      console.error('Erro ao contar usuários:', error);
      throw error;
    }
  },

  inserir: async (usuario) => {
    try {
      const { nome, email, senha, telefone } = usuario;
      
      const [result] = await db.query(
        'INSERT INTO usuarios (nome, email, senha, telefone) VALUES (?, ?, ?, ?)',
        [nome, email, senha, telefone]
      );
      
      // Retorna o objeto sem a senha por segurança
      return { 
        id: result.insertId, 
        nome,
        email,
        telefone,
        created_at: new Date()
      };
    } catch (error) {
      console.error('Erro ao inserir usuário:', error);
      throw error;
    }
  },
  
  atualizar: async (id, usuario) => {
    try {
      const { nome, email, telefone } = usuario;
      
      const [result] = await db.query(
        'UPDATE usuarios SET nome = ?, email = ?, telefone = ? WHERE id = ?',
        [nome, email, telefone, id]
      );
      
      return { 
        id: parseInt(id), 
        nome,
        email,
        telefone
      };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },
  
  atualizarSenha: async (id, novaSenha) => {
    try {
      await db.query(
        'UPDATE usuarios SET senha = ? WHERE id = ?',
        [novaSenha, id]
      );
      return true;
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      throw error;
    }
  },
  
  deletar: async (id) => {
    try {
      await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }
};