import connection from '../config/database.js';

const Admin = {
  buscarTodos: async () => {
    try {
      const [admins] = await connection.query('SELECT id, nome, email, created_at, updated_at FROM admins');
      return admins;
    } catch (error) {
      console.error('Erro ao buscar administradores:', error);
      throw error;
    }
  },
  
  buscarPorId: async (id) => {
    try {
      const [admins] = await connection.query('SELECT id, nome, email, created_at, updated_at FROM admins WHERE id = ?', [id]);
      return admins.length > 0 ? admins[0] : null;
    } catch (error) {
      console.error('Erro ao buscar administrador por ID:', error);
      throw error;
    }
  },
  
  buscarPorEmail: async (email) => {
    try {
      const [admins] = await connection.query('SELECT * FROM admins WHERE email = ?', [email]);
      return admins.length > 0 ? admins[0] : null;
    } catch (error) {
      console.error('Erro ao buscar administrador por email:', error);
      throw error;
    }
  },
  
  criar: async (admin) => {
    try {
      const [result] = await connection.query(
        'INSERT INTO admins (nome, email, senha) VALUES (?, ?, ?)', 
        [admin.nome, admin.email, admin.senha]
      );
      return { 
        id: result.insertId, 
        nome: admin.nome, 
        email: admin.email,
        created_at: new Date()
      };
    } catch (error) {
      console.error('Erro ao criar administrador:', error);
      throw error;
    }
  },
  
  atualizar: async (id, admin) => {
    try {
      await connection.query(
        'UPDATE admins SET nome = ?, email = ? WHERE id = ?',
        [admin.nome, admin.email, id]
      );
      return { 
        id: parseInt(id), 
        nome: admin.nome, 
        email: admin.email,
        updated_at: new Date()
      };
    } catch (error) {
      console.error('Erro ao atualizar administrador:', error);
      throw error;
    }
  },
  
  atualizarSenha: async (id, novaSenha) => {
    try {
      await connection.query(
        'UPDATE admins SET senha = ? WHERE id = ?',
        [novaSenha, id]
      );
      return true;
    } catch (error) {
      console.error('Erro ao atualizar senha do administrador:', error);
      throw error;
    }
  },
  
  deletar: async (id) => {
    try {
      await connection.query('DELETE FROM admins WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Erro ao deletar administrador:', error);
      throw error;
    }
  }
};

export default Admin;