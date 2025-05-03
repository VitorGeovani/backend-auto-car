import db from '../utils/db.js';

export default {
  buscarTodos: async () => {
    const [linhas] = await db.query('SELECT id, nome, email FROM admins');
    return linhas;
  },

  buscarPorCredenciais: async (email, senha) => {
    const [linhas] = await db.query('SELECT * FROM admins WHERE email = ? AND senha = ?', [email, senha]);
    return linhas[0];
  }
};