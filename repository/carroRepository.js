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

const buscarComImagens = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, cat.nome as categoria_nome, GROUP_CONCAT(i.url) as imagens
      FROM carros c
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      LEFT JOIN imagens i ON c.id = i.carro_id
      WHERE c.ativo = TRUE
      GROUP BY c.id
      ORDER BY c.id DESC
    `);
    
    // Transforma a string de imagens em um array
    return rows.map(carro => {
      return {
        ...carro,
        imagens: carro.imagens ? carro.imagens.split(',') : []
      };
    });
  } catch (error) {
    console.error('Erro ao buscar carros com imagens:', error);
    throw error;
  }
};

const buscarPorFiltros = async (filtros) => {
  try {
    let sql = `
      SELECT c.*, cat.nome as categoria_nome
      FROM carros c
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      WHERE c.ativo = TRUE
    `;
    
    const params = [];
    
    if (filtros.marca) {
      sql += ' AND c.marca = ?';
      params.push(filtros.marca);
    }
    
    if (filtros.modelo) {
      sql += ' AND c.modelo LIKE ?';
      params.push(`%${filtros.modelo}%`);
    }
    
    if (filtros.anoMin) {
      sql += ' AND c.ano >= ?';
      params.push(filtros.anoMin);
    }
    
    if (filtros.anoMax) {
      sql += ' AND c.ano <= ?';
      params.push(filtros.anoMax);
    }
    
    if (filtros.precoMin) {
      sql += ' AND c.preco >= ?';
      params.push(filtros.precoMin);
    }
    
    if (filtros.precoMax) {
      sql += ' AND c.preco <= ?';
      params.push(filtros.precoMax);
    }
    
    if (filtros.categoria_id) {
      sql += ' AND c.categoria_id = ?';
      params.push(filtros.categoria_id);
    }
    
    sql += ' ORDER BY c.id DESC';
    
    const [rows] = await pool.query(sql, params);
    return rows;
  } catch (error) {
    console.error('Erro ao buscar carros com filtros:', error);
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
      descricao, categoria_id, ativo !== undefined ? ativo : true
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
        categoria_id = ?, ativo = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      modelo, marca, ano, quilometragem, cores, 
      transmissao, combustivel, opcionais, preco, 
      descricao, categoria_id, ativo !== undefined ? ativo : true, id
    ]);
    
    return { id: parseInt(id), ...carroData };
  } catch (error) {
    console.error('Erro ao atualizar carro:', error);
    throw error;
  }
};

const desativar = async (id) => {
  try {
    await pool.query(
      'UPDATE carros SET ativo = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
      [id]
    );
    return { id: parseInt(id), ativo: false };
  } catch (error) {
    console.error('Erro ao desativar carro:', error);
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
  buscarComImagens,
  buscarPorFiltros,
  criar,
  atualizar,
  desativar,
  deletar
};