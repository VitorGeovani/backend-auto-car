import connection from '../config/database.js';

const Usuario = {
  buscarTodos: async () => {
    try {
      const [usuarios] = await connection.query('SELECT * FROM Usuarios');
      return usuarios;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },
  
  buscarPorId: async (id) => {
    try {
      const [usuarios] = await connection.query('SELECT * FROM Usuarios WHERE id = ?', [id]);
      return usuarios.length > 0 ? usuarios[0] : null;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      throw error;
    }
  },
  
  buscarPorEmail: async (email) => {
    try {
      const [usuarios] = await connection.query('SELECT * FROM Usuarios WHERE email = ?', [email]);
      return usuarios.length > 0 ? usuarios[0] : null;
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw error;
    }
  },
  
  criar: async (usuario) => {
    try {
      const [result] = await connection.query(
        'INSERT INTO Usuarios (nome, email, senha, telefone) VALUES (?, ?, ?, ?)', 
        [usuario.nome, usuario.email, usuario.senha, usuario.telefone]
      );
      return { id: result.insertId, ...usuario };
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },
  
  atualizar: async (id, usuario) => {
    try {
      await connection.query(
        'UPDATE Usuarios SET nome = ?, email = ?, telefone = ? WHERE id = ?',
        [usuario.nome, usuario.email, usuario.telefone, id]
      );
      return { id: parseInt(id), ...usuario };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },
  
  atualizarSenha: async (id, novaSenha) => {
    try {
      await connection.query('UPDATE Usuarios SET senha = ? WHERE id = ?', [novaSenha, id]);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      throw error;
    }
  },
  
  deletar: async (id) => {
    try {
      await connection.query('DELETE FROM Usuarios WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }
};

export default Usuario;