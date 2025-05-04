import pool from '../config/database.js';

const listarTodos = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, cat.nome as categoria_nome
      FROM carros c
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      ORDER BY c.id DESC
    `);
    
    return rows;
  } catch (error) {
    console.error('Erro ao listar carros:', error);
    throw error;
  }
};

const buscarPorId = async (id) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, cat.nome as categoria_nome 
      FROM carros c 
      LEFT JOIN categorias cat ON c.categoria_id = cat.id 
      WHERE c.id = ?
    `, [id]);
    
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error('Erro ao buscar carro por ID:', error);
    throw error;
  }
};

const listarAtivos = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, cat.nome as categoria_nome
      FROM carros c
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      WHERE c.ativo = TRUE
      ORDER BY c.id DESC
    `);
    
    return rows;
  } catch (error) {
    console.error('Erro ao listar carros ativos:', error);
    throw error;
  }
};

const criar = async (carroData) => {
  try {
    const { 
      modelo, marca, ano, quilometragem, cores, transmissao, 
      combustivel, opcionais, preco, descricao, categoria_id, ativo 
    } = carroData;
    
    const [result] = await pool.query(`
      INSERT INTO carros (
        modelo, marca, ano, quilometragem, cores, 
        transmissao, combustivel, opcionais, preco, 
        descricao, categoria_id, ativo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      modelo, marca, ano, quilometragem, cores, 
      transmissao, combustivel, opcionais, preco, 
      descricao, categoria_id, ativo
    ]);
    
    const id = result.insertId;
    return { id, ...carroData };
  } catch (error) {
    console.error('Erro ao criar carro:', error);
    throw error;
  }
};

const atualizar = async (id, carroData) => {
  try {
    const { 
      modelo, marca, ano, quilometragem, cores, transmissao, 
      combustivel, opcionais, preco, descricao, categoria_id, ativo 
    } = carroData;
    
    await pool.query(`
      UPDATE carros SET
        modelo = ?, marca = ?, ano = ?, quilometragem = ?, 
        cores = ?, transmissao = ?, combustivel = ?, 
        opcionais = ?, preco = ?, descricao = ?, 
        categoria_id = ?, ativo = ?
      WHERE id = ?
    `, [
      modelo, marca, ano, quilometragem, cores, 
      transmissao, combustivel, opcionais, preco, 
      descricao, categoria_id, ativo, id
    ]);
    
    return { id: parseInt(id), ...carroData };
  } catch (error) {
    console.error('Erro ao atualizar carro:', error);
    throw error;
  }
};

const deletar = async (id) => {
  try {
    await pool.query('DELETE FROM carros WHERE id = ?', [id]);
    return { id: parseInt(id) };
  } catch (error) {
    console.error('Erro ao deletar carro:', error);
    throw error;
  }
};

export default {
  listarTodos,
  buscarPorId,
  listarAtivos,
  criar,
  atualizar,
  deletar
};