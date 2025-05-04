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

const adicionar = async (itemData) => {
  try {
    const { carro_id, quantidade, localizacao } = itemData;
    
    const [result] = await pool.query(`
      INSERT INTO estoque (carro_id, quantidade, localizacao)
      VALUES (?, ?, ?)
    `, [carro_id, quantidade, localizacao]);
    
    const id = result.insertId;
    return { id, ...itemData };
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
  adicionar,
  atualizar,
  deletar
};