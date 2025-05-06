import db from '../utils/db.js';

export default {
  buscarTodos: async () => {
    const [linhas] = await db.query('SELECT id, nome, email, created_at, updated_at FROM admins');
    return linhas;
  },

  buscarPorCredenciais: async (email, senha) => {
    const [linhas] = await db.query('SELECT * FROM admins WHERE email = ? AND senha = ?', [email, senha]);
    return linhas[0];
  },
  
  buscarPorId: async (id) => {
    const [linhas] = await db.query('SELECT id, nome, email, created_at, updated_at FROM admins WHERE id = ?', [id]);
    return linhas.length > 0 ? linhas[0] : null;
  },
  
  buscarPorEmail: async (email) => {
    const [linhas] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    return linhas.length > 0 ? linhas[0] : null;
  },
  
  criar: async (admin) => {
    const [resultado] = await db.query(
      'INSERT INTO admins (nome, email, senha) VALUES (?, ?, ?)', 
      [admin.nome, admin.email, admin.senha]
    );
    
    return {
      id: resultado.insertId,
      nome: admin.nome,
      email: admin.email,
      created_at: new Date()
    };
  },
  
  atualizar: async (id, admin) => {
    await db.query(
      'UPDATE admins SET nome = ?, email = ? WHERE id = ?',
      [admin.nome, admin.email, id]
    );
    
    return {
      id: parseInt(id),
      nome: admin.nome,
      email: admin.email,
      updated_at: new Date()
    };
  },
  
  atualizarSenha: async (id, novaSenha) => {
    await db.query('UPDATE admins SET senha = ? WHERE id = ?', [novaSenha, id]);
    return true;
  },
  
  deletar: async (id) => {
    await db.query('DELETE FROM admins WHERE id = ?', [id]);
    return true;
  }
};