import db from '../config/database.js';

const Agendamento = {
  buscarTodos: (callback) => {
    const sql = `
      SELECT ag.*, us.nome as nome_usuario, ca.modelo as modelo_carro
      FROM agendamentos ag
      LEFT JOIN usuarios us ON ag.usuario_id = us.id
      JOIN carros ca ON ag.carro_id = ca.id
      ORDER BY ag.data_agendamento DESC
    `;
    db.query(sql, callback);
  },

  buscarPorId: (id, callback) => {
    const sql = `
      SELECT ag.*, us.nome as nome_usuario, ca.modelo as modelo_carro, ca.marca as marca_carro
      FROM agendamentos ag
      LEFT JOIN usuarios us ON ag.usuario_id = us.id
      JOIN carros ca ON ag.carro_id = ca.id
      WHERE ag.id = ?
    `;
    db.query(sql, [id], callback);
  },

  buscarPorUsuario: (usuarioId, callback) => {
    const sql = `
      SELECT ag.*, ca.modelo as modelo_carro, ca.marca as marca_carro
      FROM agendamentos ag
      JOIN carros ca ON ag.carro_id = ca.id
      WHERE ag.usuario_id = ?
      ORDER BY ag.data_agendamento DESC
    `;
    db.query(sql, [usuarioId], callback);
  },

  buscarPorCarro: (carroId, callback) => {
    const sql = `
      SELECT ag.*, us.nome as nome_usuario
      FROM agendamentos ag
      LEFT JOIN usuarios us ON ag.usuario_id = us.id
      WHERE ag.carro_id = ?
      ORDER BY ag.data_agendamento DESC
    `;
    db.query(sql, [carroId], callback);
  },

  buscarPorStatus: (status, callback) => {
    const sql = `
      SELECT ag.*, us.nome as nome_usuario, ca.modelo as modelo_carro
      FROM agendamentos ag
      LEFT JOIN usuarios us ON ag.usuario_id = us.id
      JOIN carros ca ON ag.carro_id = ca.id
      WHERE ag.status = ?
      ORDER BY ag.data_agendamento DESC
    `;
    db.query(sql, [status], callback);
  },

  criar: (agendamento, callback) => {
    // Se dados de contato estiverem presentes (para interesses)
    if (agendamento.nome_contato || agendamento.email_contato || agendamento.telefone_contato) {
      const sql = `INSERT INTO agendamentos 
        (data_agendamento, status, observacoes, usuario_id, carro_id, nome_contato, email_contato, telefone_contato) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      
      db.query(sql, [
        agendamento.data_agendamento,
        agendamento.status || 'pendente',
        agendamento.observacoes,
        agendamento.usuario_id,
        agendamento.carro_id,
        agendamento.nome_contato,
        agendamento.email_contato,
        agendamento.telefone_contato
      ], callback);
    } else {
      // Formato original para agendamentos
      const sql = `INSERT INTO agendamentos 
        (data_agendamento, status, observacoes, usuario_id, carro_id) 
        VALUES (?, ?, ?, ?, ?)`;
        
      db.query(sql, [
        agendamento.data_agendamento,
        agendamento.status || 'pendente',
        agendamento.observacoes,
        agendamento.usuario_id,
        agendamento.carro_id
      ], callback);
    }
  },

  atualizar: (id, agendamento, callback) => {
    const sql = `UPDATE agendamentos SET
      data_agendamento = ?,
      status = ?,
      observacoes = ?,
      nome_contato = ?,
      email_contato = ?,
      telefone_contato = ?
      WHERE id = ?`;
    
    db.query(sql, [
      agendamento.data_agendamento,
      agendamento.status,
      agendamento.observacoes,
      agendamento.nome_contato || null,
      agendamento.email_contato || null,
      agendamento.telefone_contato || null,
      id
    ], callback);
  },

  atualizarStatus: (id, status, callback) => {
    const sql = 'UPDATE agendamentos SET status = ? WHERE id = ?';
    db.query(sql, [status, id], callback);
  },

  confirmar: (id, callback) => {
    const sql = 'UPDATE agendamentos SET status = "confirmado" WHERE id = ?';
    db.query(sql, [id], callback);
  },

  cancelar: (id, callback) => {
    const sql = 'UPDATE agendamentos SET status = "cancelado" WHERE id = ?';
    db.query(sql, [id], callback);
  },

  deletar: (id, callback) => {
    const sql = 'DELETE FROM agendamentos WHERE id = ?';
    db.query(sql, [id], callback);
  },
  
  verificarDisponibilidade: (data, carroId, callback) => {
    const sql = `
      SELECT COUNT(*) as total 
      FROM agendamentos 
      WHERE carro_id = ? AND data_agendamento = ? AND status != 'cancelado'
    `;
    db.query(sql, [carroId, data], callback);
  }
};

export default Agendamento;