import db from '../utils/db.js';

export default {
  buscarTodos: async () => {
    const [linhas] = await db.query(`
      SELECT ag.*, us.nome as nome_usuario, ca.modelo as modelo_carro
      FROM agendamentos ag
      LEFT JOIN usuarios us ON ag.usuario_id = us.id
      JOIN carros ca ON ag.carro_id = ca.id
      ORDER BY ag.data_agendamento DESC
    `);
    return linhas;
  },

  buscarPorId: async (id) => {
    const [linhas] = await db.query(`
      SELECT ag.*, us.nome as nome_usuario, ca.modelo as modelo_carro, ca.marca as marca_carro
      FROM agendamentos ag
      LEFT JOIN usuarios us ON ag.usuario_id = us.id
      JOIN carros ca ON ag.carro_id = ca.id
      WHERE ag.id = ?
    `, [id]);
    return linhas[0];
  },

  buscarPorUsuario: async (usuarioId) => {
    const [linhas] = await db.query(`
      SELECT ag.*, ca.modelo as modelo_carro, ca.marca as marca_carro
      FROM agendamentos ag
      JOIN carros ca ON ag.carro_id = ca.id
      WHERE ag.usuario_id = ?
      ORDER BY ag.data_agendamento DESC
    `, [usuarioId]);
    return linhas;
  },

  buscarPorCarro: async (carroId) => {
    const [linhas] = await db.query(`
      SELECT ag.*, us.nome as nome_usuario
      FROM agendamentos ag
      LEFT JOIN usuarios us ON ag.usuario_id = us.id
      WHERE ag.carro_id = ?
      ORDER BY ag.data_agendamento DESC
    `, [carroId]);
    return linhas;
  },

  buscarPorStatus: async (status) => {
    const [linhas] = await db.query(`
      SELECT ag.*, us.nome as nome_usuario, ca.modelo as modelo_carro
      FROM agendamentos ag
      LEFT JOIN usuarios us ON ag.usuario_id = us.id
      JOIN carros ca ON ag.carro_id = ca.id
      WHERE ag.status = ?
      ORDER BY ag.data_agendamento DESC
    `, [status]);
    return linhas;
  },

  inserir: async (agendamento) => {
    // Verifica se possui dados de contato
    if (agendamento.nome_contato || agendamento.email_contato || agendamento.telefone_contato) {
      const [resultado] = await db.query(`
        INSERT INTO agendamentos 
        (data_agendamento, status, observacoes, usuario_id, carro_id, nome_contato, email_contato, telefone_contato) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        agendamento.data_agendamento,
        agendamento.status || 'pendente',
        agendamento.observacoes,
        agendamento.usuario_id,
        agendamento.carro_id,
        agendamento.nome_contato,
        agendamento.email_contato,
        agendamento.telefone_contato
      ]);
      return resultado.insertId;
    } else {
      const [resultado] = await db.query(`
        INSERT INTO agendamentos 
        (data_agendamento, status, observacoes, usuario_id, carro_id) 
        VALUES (?, ?, ?, ?, ?)
      `, [
        agendamento.data_agendamento,
        agendamento.status || 'pendente',
        agendamento.observacoes,
        agendamento.usuario_id,
        agendamento.carro_id
      ]);
      return resultado.insertId;
    }
  },

  atualizar: async (id, agendamento) => {
    const [resultado] = await db.query(`
      UPDATE agendamentos SET
        data_agendamento = ?,
        status = ?,
        observacoes = ?,
        nome_contato = ?,
        email_contato = ?,
        telefone_contato = ?
      WHERE id = ?
    `, [
      agendamento.data_agendamento,
      agendamento.status,
      agendamento.observacoes,
      agendamento.nome_contato || null,
      agendamento.email_contato || null,
      agendamento.telefone_contato || null,
      id
    ]);
    return resultado.affectedRows > 0;
  },

  atualizarStatus: async (id, status) => {
    const [resultado] = await db.query('UPDATE agendamentos SET status = ? WHERE id = ?', [status, id]);
    return resultado.affectedRows > 0;
  },

  confirmar: async (id) => {
    const [resultado] = await db.query('UPDATE agendamentos SET status = "confirmado" WHERE id = ?', [id]);
    return resultado.affectedRows > 0;
  },

  cancelar: async (id) => {
    const [resultado] = await db.query('UPDATE agendamentos SET status = "cancelado" WHERE id = ?', [id]);
    return resultado.affectedRows > 0;
  },

  deletar: async (id) => {
    const [resultado] = await db.query('DELETE FROM agendamentos WHERE id = ?', [id]);
    return resultado.affectedRows > 0;
  },

  verificarDisponibilidade: async (data, carroId) => {
    const [resultado] = await db.query(`
      SELECT COUNT(*) as total 
      FROM agendamentos 
      WHERE carro_id = ? AND data_agendamento = ? AND status != 'cancelado'
    `, [carroId, data]);
    return resultado[0].total === 0;
  }
};