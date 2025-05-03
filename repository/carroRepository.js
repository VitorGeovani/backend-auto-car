import pool from '../config/database.js';

const buscarTodos = async () => {
  try {
    const query = `
      SELECT c.*,
        (SELECT GROUP_CONCAT(i.url) FROM imagens i WHERE i.carro_id = c.id) as imagens
      FROM carros c
      ORDER BY c.created_at DESC
    `;
    
    const [carros] = await pool.execute(query);
    
    // Converter string de imagens em array
    return carros.map(carro => {
      return {
        ...carro,
        imagens: carro.imagens ? carro.imagens.split(',') : []
      };
    });
  } catch (error) {
    console.error('Erro ao buscar todos os carros:', error);
    throw error;
  }
};

const buscarPorId = async (id) => {
  try {
    const query = `
      SELECT c.*,
        (SELECT GROUP_CONCAT(i.url) FROM imagens i WHERE i.carro_id = c.id) as imagens
      FROM carros c
      WHERE c.id = ?
    `;
    
    const [carros] = await pool.execute(query, [id]);
    
    if (carros.length === 0) {
      return null;
    }
    
    // Converter string de imagens em array
    const carro = carros[0];
    return {
      ...carro,
      imagens: carro.imagens ? carro.imagens.split(',') : []
    };
  } catch (error) {
    console.error('Erro ao buscar carro por ID:', error);
    throw error;
  }
};

const inserir = async (carro) => {
  try {
    const query = `
      INSERT INTO carros 
      (modelo, marca, ano, preco, descricao, quilometragem, cores, transmissao, combustivel, opcionais, categoria_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(query, [
      carro.modelo,
      carro.marca,
      carro.ano,
      carro.preco,
      carro.descricao,
      carro.quilometragem,
      carro.cores,
      carro.transmissao,
      carro.combustivel,
      carro.opcionais,
      carro.categoria_id
    ]);
    
    return { id: result.insertId, ...carro };
  } catch (error) {
    console.error('Erro ao inserir carro:', error);
    throw error;
  }
};

const atualizar = async (id, carro) => {
  try {
    const query = `
      UPDATE carros 
      SET modelo = ?, 
          marca = ?, 
          ano = ?, 
          preco = ?, 
          descricao = ?, 
          quilometragem = ?, 
          cores = ?, 
          transmissao = ?, 
          combustivel = ?, 
          opcionais = ?, 
          categoria_id = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await pool.execute(query, [
      carro.modelo,
      carro.marca,
      carro.ano,
      carro.preco,
      carro.descricao,
      carro.quilometragem,
      carro.cores,
      carro.transmissao,
      carro.combustivel,
      carro.opcionais,
      carro.categoria_id,
      id
    ]);
    
    return { id: parseInt(id), ...carro };
  } catch (error) {
    console.error('Erro ao atualizar carro:', error);
    throw error;
  }
};

const excluir = async (id) => {
  try {
    // Primeiro excluir as imagens relacionadas
    await pool.execute('DELETE FROM imagens WHERE carro_id = ?', [id]);
    
    // Depois excluir o carro
    const query = 'DELETE FROM carros WHERE id = ?';
    await pool.execute(query, [id]);
    
    return { id: parseInt(id) };
  } catch (error) {
    console.error('Erro ao excluir carro:', error);
    throw error;
  }
};

const buscarPorCategoria = async (categoriaId) => {
  try {
    const query = `
      SELECT c.*,
        (SELECT GROUP_CONCAT(i.url) FROM imagens i WHERE i.carro_id = c.id) as imagens
      FROM carros c
      WHERE c.categoria_id = ?
      ORDER BY c.created_at DESC
    `;
    
    const [carros] = await pool.execute(query, [categoriaId]);
    
    return carros.map(carro => {
      return {
        ...carro,
        imagens: carro.imagens ? carro.imagens.split(',') : []
      };
    });
  } catch (error) {
    console.error('Erro ao buscar carros por categoria:', error);
    throw error;
  }
};

const buscarPorFiltros = async (filtros) => {
  try {
    let query = `
      SELECT c.*,
        (SELECT GROUP_CONCAT(i.url) FROM imagens i WHERE i.carro_id = c.id) as imagens
      FROM carros c
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filtros.marca) {
      query += ' AND c.marca LIKE ?';
      params.push(`%${filtros.marca}%`);
    }
    
    if (filtros.modelo) {
      query += ' AND c.modelo LIKE ?';
      params.push(`%${filtros.modelo}%`);
    }
    
    if (filtros.anoMin) {
      query += ' AND c.ano >= ?';
      params.push(parseInt(filtros.anoMin));
    }
    
    if (filtros.anoMax) {
      query += ' AND c.ano <= ?';
      params.push(parseInt(filtros.anoMax));
    }
    
    if (filtros.precoMin) {
      query += ' AND c.preco >= ?';
      params.push(parseFloat(filtros.precoMin));
    }
    
    if (filtros.precoMax) {
      query += ' AND c.preco <= ?';
      params.push(parseFloat(filtros.precoMax));
    }
    
    if (filtros.categoria_id) {
      query += ' AND c.categoria_id = ?';
      params.push(parseInt(filtros.categoria_id));
    }

    if (filtros.combustivel) {
      query += ' AND c.combustivel = ?';
      params.push(filtros.combustivel);
    }

    if (filtros.transmissao) {
      query += ' AND c.transmissao = ?';
      params.push(filtros.transmissao);
    }
    
    query += ' ORDER BY c.created_at DESC';
    
    const [carros] = await pool.execute(query, params);
    
    return carros.map(carro => {
      return {
        ...carro,
        imagens: carro.imagens ? carro.imagens.split(',') : []
      };
    });
  } catch (error) {
    console.error('Erro ao buscar carros por filtros:', error);
    throw error;
  }
};

export {
  buscarTodos,
  buscarPorId,
  inserir,
  atualizar,
  excluir as deletar,
  buscarPorCategoria,
  buscarPorFiltros
};

export default {
  buscarTodos,
  buscarPorId,
  inserir,
  atualizar,
  deletar: excluir,
  buscarPorCategoria,
  buscarPorFiltros
};