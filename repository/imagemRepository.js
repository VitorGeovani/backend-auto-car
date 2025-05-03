import pool from '../config/database.js';

const inserir = async (carro_id, url) => {
  try {
    const query = 'INSERT INTO imagens (carro_id, url) VALUES (?, ?)';
    const [result] = await pool.execute(query, [carro_id, url]);
    
    return {
      id: result.insertId,
      carro_id,
      url
    };
  } catch (error) {
    console.error('Erro ao inserir imagem:', error);
    throw error;
  }
};

const buscarPorCarroId = async (carro_id) => {
  try {
    const query = 'SELECT * FROM imagens WHERE carro_id = ?';
    const [imagens] = await pool.execute(query, [carro_id]);
    
    return imagens;
  } catch (error) {
    console.error('Erro ao buscar imagens por carro_id:', error);
    throw error;
  }
};

const buscarPorId = async (id) => {
  try {
    const query = 'SELECT * FROM imagens WHERE id = ?';
    const [imagens] = await pool.execute(query, [id]);
    
    return imagens.length > 0 ? imagens[0] : null;
  } catch (error) {
    console.error('Erro ao buscar imagem por ID:', error);
    throw error;
  }
};

const excluir = async (id) => {
  try {
    const query = 'DELETE FROM imagens WHERE id = ?';
    await pool.execute(query, [id]);
    
    return { id: parseInt(id) };
  } catch (error) {
    console.error('Erro ao excluir imagem:', error);
    throw error;
  }
};

// Adicionando função para excluir todas as imagens de um carro
const excluirPorCarroId = async (carro_id) => {
  try {
    const query = 'DELETE FROM imagens WHERE carro_id = ?';
    const [result] = await pool.execute(query, [carro_id]);
    
    return { 
      carro_id: parseInt(carro_id),
      registrosExcluidos: result.affectedRows 
    };
  } catch (error) {
    console.error('Erro ao excluir imagens por carro_id:', error);
    throw error;
  }
};

export default {
  inserir,
  buscarPorCarroId,
  buscarPorId,
  excluir,
  excluirPorCarroId
};