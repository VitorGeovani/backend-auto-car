import pool from '../config/database.js';

// Buscar todas as imagens com informações do carro
const buscarTodas = async () => {
  try {
    const query = `
      SELECT i.*, c.marca, c.modelo 
      FROM imagens i 
      JOIN carros c ON i.carro_id = c.id 
      ORDER BY i.created_at DESC
    `;
    const [imagens] = await pool.execute(query);
    return imagens;
  } catch (error) {
    console.error('Erro ao buscar todas as imagens:', error);
    throw error;
  }
};

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

// Inserir múltiplas imagens de uma vez
const inserirMultiplas = async (imagens) => {
  try {
    if (!imagens || imagens.length === 0) {
      return { affectedRows: 0 };
    }
    
    const query = 'INSERT INTO imagens (url, carro_id) VALUES ?';
    const valores = imagens.map(img => [img.url, img.carro_id]);
    
    const [result] = await pool.query(query, [valores]);
    return {
      insertId: result.insertId,
      affectedRows: result.affectedRows
    };
  } catch (error) {
    console.error('Erro ao inserir múltiplas imagens:', error);
    throw error;
  }
};

const buscarPorCarroId = async (carro_id) => {
  try {
    const query = 'SELECT * FROM imagens WHERE carro_id = ? ORDER BY created_at DESC';
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

// Contar imagens por carro
const contarPorCarro = async (carro_id) => {
  try {
    const query = 'SELECT COUNT(*) as total FROM imagens WHERE carro_id = ?';
    const [resultado] = await pool.execute(query, [carro_id]);
    
    return resultado[0].total;
  } catch (error) {
    console.error('Erro ao contar imagens por carro:', error);
    throw error;
  }
};

// Atualizar URL de uma imagem
const atualizar = async (id, url) => {
  try {
    const query = 'UPDATE imagens SET url = ? WHERE id = ?';
    await pool.execute(query, [url, id]);
    
    return {
      id: parseInt(id),
      url
    };
  } catch (error) {
    console.error('Erro ao atualizar URL da imagem:', error);
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
  inserirMultiplas,
  buscarTodas,
  buscarPorCarroId,
  buscarPorId,
  contarPorCarro,
  atualizar,
  excluir,
  excluirPorCarroId
};