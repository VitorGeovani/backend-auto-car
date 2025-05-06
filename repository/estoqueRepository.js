import pool from '../config/database.js';

const listarTodos = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, c.modelo, c.marca, c.ano, c.preco
      FROM estoque e
      INNER JOIN carros c ON e.carro_id = c.id
      ORDER BY e.id DESC
    `);
    
    return rows;
  } catch (error) {
    console.error('Erro ao listar estoque:', error);
    throw error;
  }
};

const buscarPorId = async (id) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, c.modelo, c.marca, c.ano, c.preco
      FROM estoque e
      INNER JOIN carros c ON e.carro_id = c.id
      WHERE e.id = ?
    `, [id]);
    
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error('Erro ao buscar item por ID:', error);
    throw error;
  }
};

const buscarPorCarroId = async (carro_id) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, c.modelo, c.marca, c.ano, c.preco
      FROM estoque e
      INNER JOIN carros c ON e.carro_id = c.id
      WHERE e.carro_id = ?
    `, [carro_id]);
    
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error('Erro ao buscar estoque por carro_id:', error);
    throw error;
  }
};

// Método novo: Listar apenas carros disponíveis em estoque
const listarDisponiveis = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, c.modelo, c.marca, c.ano, c.preco
      FROM estoque e
      INNER JOIN carros c ON e.carro_id = c.id
      WHERE e.quantidade > 0 AND c.ativo = TRUE
      ORDER BY c.marca, c.modelo
    `);
    
    return rows;
  } catch (error) {
    console.error('Erro ao listar estoque disponível:', error);
    throw error;
  }
};

const adicionar = async (itemData) => {
  try {
    const { carro_id, quantidade = 1, localizacao = 'Matriz' } = itemData;
    
    const [result] = await pool.query(`
      INSERT INTO estoque (carro_id, quantidade, localizacao)
      VALUES (?, ?, ?)
    `, [carro_id, quantidade, localizacao]);
    
    const id = result.insertId;
    return { id, carro_id, quantidade, localizacao };
  } catch (error) {
    console.error('Erro ao adicionar item ao estoque:', error);
    throw error;
  }
};

const atualizar = async (id, itemData) => {
  try {
    const { quantidade, localizacao } = itemData;
    
    await pool.query(`
      UPDATE estoque SET
        quantidade = ?,
        localizacao = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [quantidade, localizacao, id]);
    
    return { id: parseInt(id), ...itemData };
  } catch (error) {
    console.error('Erro ao atualizar item do estoque:', error);
    throw error;
  }
};

// Método novo: Atualizar apenas a quantidade
const atualizarQuantidade = async (carroId, quantidade) => {
  try {
    const [result] = await pool.query(`
      UPDATE estoque 
      SET quantidade = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE carro_id = ?
    `, [quantidade, carroId]);
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Erro ao atualizar quantidade no estoque:', error);
    throw error;
  }
};

// Método novo: Reduzir quantidade (para vendas)
const reduzirQuantidade = async (carroId, quantidade = 1) => {
  try {
    const [result] = await pool.query(`
      UPDATE estoque 
      SET quantidade = quantidade - ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE carro_id = ? AND quantidade >= ?
    `, [quantidade, carroId, quantidade]);
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Erro ao reduzir quantidade no estoque:', error);
    throw error;
  }
};

// Método novo: Aumentar quantidade (para reposição)
const aumentarQuantidade = async (carroId, quantidade = 1) => {
  try {
    const [result] = await pool.query(`
      UPDATE estoque 
      SET quantidade = quantidade + ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE carro_id = ?
    `, [quantidade, carroId]);
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Erro ao aumentar quantidade no estoque:', error);
    throw error;
  }
};

// Método novo: Verificar disponibilidade
const verificarDisponibilidade = async (carroId, quantidadeNecessaria = 1) => {
  try {
    const [rows] = await pool.query(`
      SELECT quantidade >= ? as disponivel 
      FROM estoque 
      WHERE carro_id = ?
    `, [quantidadeNecessaria, carroId]);
    
    if (!rows.length) return false;
    return rows[0].disponivel === 1;
  } catch (error) {
    console.error('Erro ao verificar disponibilidade no estoque:', error);
    throw error;
  }
};

const deletar = async (id) => {
  try {
    await pool.query('DELETE FROM estoque WHERE id = ?', [id]);
    return { id: parseInt(id) };
  } catch (error) {
    console.error('Erro ao deletar item do estoque:', error);
    throw error;
  }
};

export default {
  listarTodos,
  buscarPorId,
  buscarPorCarroId,
  listarDisponiveis,
  adicionar,
  atualizar,
  atualizarQuantidade,
  reduzirQuantidade,
  aumentarQuantidade,
  verificarDisponibilidade,
  deletar
};