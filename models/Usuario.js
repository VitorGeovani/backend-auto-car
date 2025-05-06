import connection from '../config/database.js';

const Usuario = {
  buscarTodos: async (paginacao = null) => {
    try {
      let sql = 'SELECT id, nome, email, telefone, created_at FROM usuarios';
      
      if (paginacao) {
        const { limite = 10, pagina = 1 } = paginacao;
        const offset = (pagina - 1) * limite;
        sql += ` LIMIT ${limite} OFFSET ${offset}`;
      }
      
      const [usuarios] = await connection.query(sql);
      return usuarios;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },
  
  buscarPorId: async (id) => {
    try {
      // Não retorna a senha por segurança
      const [usuarios] = await connection.query(
        'SELECT id, nome, email, telefone, created_at FROM usuarios WHERE id = ?',
        [id]
      );
      return usuarios.length > 0 ? usuarios[0] : null;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      throw error;
    }
  },
  
  buscarPorEmail: async (email) => {
    try {
      const [usuarios] = await connection.query('SELECT * FROM usuarios WHERE email = ?', [email]);
      return usuarios.length > 0 ? usuarios[0] : null;
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw error;
    }
  },
  
  buscarPorNome: async (nome) => {
    try {
      const [usuarios] = await connection.query(
        'SELECT id, nome, email, telefone, created_at FROM usuarios WHERE nome LIKE ?',
        [`%${nome}%`]
      );
      return usuarios;
    } catch (error) {
      console.error('Erro ao buscar usuários por nome:', error);
      throw error;
    }
  },
  
  contar: async () => {
    try {
      const [result] = await connection.query('SELECT COUNT(*) as total FROM usuarios');
      return result[0].total;
    } catch (error) {
      console.error('Erro ao contar usuários:', error);
      throw error;
    }
  },
  
  criar: async (usuario) => {
    try {
      const [result] = await connection.query(
        'INSERT INTO usuarios (nome, email, senha, telefone) VALUES (?, ?, ?, ?)', 
        [usuario.nome, usuario.email, usuario.senha, usuario.telefone]
      );
      
      // Retorna o objeto sem a senha por segurança
      return { 
        id: result.insertId, 
        nome: usuario.nome, 
        email: usuario.email, 
        telefone: usuario.telefone,
        created_at: new Date()
      };
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },
  
  atualizar: async (id, usuario) => {
    try {
      await connection.query(
        'UPDATE usuarios SET nome = ?, email = ?, telefone = ? WHERE id = ?',
        [usuario.nome, usuario.email, usuario.telefone, id]
      );
      return { 
        id: parseInt(id), 
        nome: usuario.nome, 
        email: usuario.email, 
        telefone: usuario.telefone
      };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },
  
  atualizarSenha: async (id, novaSenha) => {
    try {
      await connection.query('UPDATE usuarios SET senha = ? WHERE id = ?', [novaSenha, id]);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      throw error;
    }
  },
  
  deletar: async (id) => {
    try {
      await connection.query('DELETE FROM usuarios WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }
};

export default Usuario;