import db from '../config/database.js';

const Agendamento = {
  buscarTodos: (callback) => {
    const sql = `
      SELECT ag.*, us.nome as nome_usuario, ca.modelo as modelo_carro
      FROM agendamentos ag
      LEFT JOIN usuarios us ON ag.usuario_id = us.id
      JOIN carros ca ON ag.carro_id = ca.id
    `;
    db.query(sql, callback);
  },

  criar: (agendamento, callback) => {
    // Se dados de contato estiverem presentes (para interesses)
    if (agendamento.nome_contato || agendamento.email_contato || agendamento.telefone_contato) {
      const sql = `INSERT INTO agendamentos 
        (data_agendamento, status, observacoes, usuario_id, carro_id, nome_contato, email_contato, telefone_contato) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      
      db.query(sql, [
        agendamento.data_agendamento,
        agendamento.status,
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
        agendamento.status,
        agendamento.observacoes,
        agendamento.usuario_id,
        agendamento.carro_id
      ], callback);
    }
  }
};

export default Agendamento;