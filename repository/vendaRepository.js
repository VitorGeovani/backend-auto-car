import db from '../utils/db.js';

export default {
  buscarTodas: async () => {
    try {
      const [linhas] = await db.query(`
        SELECT v.*, u.nome as nome_usuario, c.modelo as modelo_carro, c.marca as marca_carro
        FROM vendas v
        JOIN usuarios u ON v.usuario_id = u.id
        JOIN carros c ON v.carro_id = c.id
        ORDER BY v.data_venda DESC
      `);
      return linhas;
    } catch (error) {
      console.error('Erro ao buscar todas as vendas:', error);
      throw error;
    }
  },
  
  buscarPorId: async (id) => {
    try {
      const [linhas] = await db.query(`
        SELECT v.*, u.nome as nome_usuario, c.modelo as modelo_carro, c.marca as marca_carro
        FROM vendas v
        JOIN usuarios u ON v.usuario_id = u.id
        JOIN carros c ON v.carro_id = c.id
        WHERE v.id = ?
      `, [id]);
      
      return linhas.length > 0 ? linhas[0] : null;
    } catch (error) {
      console.error('Erro ao buscar venda por ID:', error);
      throw error;
    }
  },
  
  buscarPorUsuario: async (usuarioId) => {
    try {
      const [linhas] = await db.query(`
        SELECT v.*, c.modelo as modelo_carro, c.marca as marca_carro, c.ano
        FROM vendas v
        JOIN carros c ON v.carro_id = c.id
        WHERE v.usuario_id = ?
        ORDER BY v.data_venda DESC
      `, [usuarioId]);
      
      return linhas;
    } catch (error) {
      console.error('Erro ao buscar vendas por usuário:', error);
      throw error;
    }
  },
  
  buscarPorCarro: async (carroId) => {
    try {
      const [linhas] = await db.query(`
        SELECT v.*, u.nome as nome_usuario
        FROM vendas v
        JOIN usuarios u ON v.usuario_id = u.id
        WHERE v.carro_id = ?
        ORDER BY v.data_venda DESC
      `, [carroId]);
      
      return linhas;
    } catch (error) {
      console.error('Erro ao buscar vendas por carro:', error);
      throw error;
    }
  },
  
  buscarPorPeriodo: async (dataInicio, dataFim) => {
    try {
      const [linhas] = await db.query(`
        SELECT v.*, u.nome as nome_usuario, c.modelo as modelo_carro, c.marca as marca_carro
        FROM vendas v
        JOIN usuarios u ON v.usuario_id = u.id
        JOIN carros c ON v.carro_id = c.id
        WHERE v.data_venda BETWEEN ? AND ?
        ORDER BY v.data_venda DESC
      `, [dataInicio, dataFim]);
      
      return linhas;
    } catch (error) {
      console.error('Erro ao buscar vendas por período:', error);
      throw error;
    }
  },
  
  contarTotal: async () => {
    try {
      const [resultado] = await db.query('SELECT COUNT(*) as total FROM vendas');
      return resultado[0].total;
    } catch (error) {
      console.error('Erro ao contar total de vendas:', error);
      throw error;
    }
  },
  
  somarValores: async () => {
    try {
      const [resultado] = await db.query('SELECT SUM(valor_final) as total FROM vendas');
      return resultado[0].total || 0;
    } catch (error) {
      console.error('Erro ao somar valores das vendas:', error);
      throw error;
    }
  },
  
  calcularMediaVendas: async () => {
    try {
      const [resultado] = await db.query('SELECT AVG(valor_final) as media FROM vendas');
      return resultado[0].media || 0;
    } catch (error) {
      console.error('Erro ao calcular média das vendas:', error);
      throw error;
    }
  },
  
  inserir: async ({ valor_final, usuario_id, carro_id, data_venda }) => {
    try {
      const [resultado] = await db.query(
        'INSERT INTO vendas (data_venda, valor_final, usuario_id, carro_id) VALUES (?, ?, ?, ?)', 
        [data_venda || new Date(), valor_final, usuario_id, carro_id]
      );
      
      return {
        id: resultado.insertId,
        data_venda: data_venda || new Date(),
        valor_final,
        usuario_id,
        carro_id
      };
    } catch (error) {
      console.error('Erro ao inserir venda:', error);
      throw error;
    }
  },
  
  atualizar: async (id, { valor_final, usuario_id, carro_id }) => {
    try {
      await db.query(
        'UPDATE vendas SET valor_final = ?, usuario_id = ?, carro_id = ? WHERE id = ?',
        [valor_final, usuario_id, carro_id, id]
      );
      
      return {
        id: parseInt(id),
        valor_final,
        usuario_id,
        carro_id,
        atualizado: true
      };
    } catch (error) {
      console.error('Erro ao atualizar venda:', error);
      throw error;
    }
  },
  
  excluir: async (id) => {
    try {
      await db.query('DELETE FROM vendas WHERE id = ?', [id]);
      return { sucesso: true };
    } catch (error) {
      console.error('Erro ao excluir venda:', error);
      throw error;
    }
  }
};