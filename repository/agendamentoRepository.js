import db from '../utils/db.js';

export default {
  buscarTodos: async () => {
    const [linhas] = await db.query('SELECT * FROM agendamentos');
    return linhas;
  },

  inserir: async ({ data_agendamento, status, observacoes, usuario_id, carro_id }) => {
    await db.query('INSERT INTO agendamentos (data_agendamento, status, observacoes, usuario_id, carro_id) VALUES (?, ?, ?, ?, ?)', [data_agendamento, status, observacoes, usuario_id, carro_id]);
  },

  atualizarStatus: async (id, status) => {
    await db.query('UPDATE agendamentos SET status = ? WHERE id = ?', [status, id]);
  },

  deletar: async (id) => {
    await db.query('DELETE FROM agendamentos WHERE id = ?', [id]);
  }
};