import db from '../utils/db.js';

export default {
  buscarTodas: async () => {
    const [linhas] = await db.query('SELECT * FROM vendas');
    return linhas;
  },

  inserir: async ({ valor_final, usuario_id, carro_id }) => {
    await db.query('INSERT INTO vendas (valor_final, usuario_id, carro_id) VALUES (?, ?, ?)', [valor_final, usuario_id, carro_id]);
  }
};