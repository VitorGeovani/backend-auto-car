import db from '../config/database.js';

const DashboardController = {
  getStats: async (req, res) => {
    try {
      // Usar Promise.all para executar todas as consultas em paralelo
      const [clientesResult, estoqueResult, interessesResult] = await Promise.all([
        // Consulta SQL direta para cada estatística
        db.query("SELECT COUNT(*) as total FROM usuarios"),
        db.query("SELECT COUNT(*) as total FROM estoque WHERE quantidade > 0"),
        db.query("SELECT COUNT(*) as total FROM interesses")
      ]);
      
      // Extrair os valores das consultas
      const clientes = clientesResult[0][0]?.total || 0;
      const estoque = estoqueResult[0][0]?.total || 0;
      const interesses = interessesResult[0][0]?.total || 0;
      
      console.log('Estatísticas recuperadas com sucesso:', {
        clientes,
        estoque, 
        interesses
      });
      
      // Retornar estatísticas para o frontend
      res.json({
        clientes: clientes,
        estoque: estoque,
        depoimentos: 0,
        interesses: interesses,
        vendas: 0,
        agendamentos: 0
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      
      // Fornecer um fallback em caso de erro
      return res.json({
        clientes: 0,
        estoque: 0,
        depoimentos: 0,
        interesses: 0,
        vendas: 0,
        agendamentos: 0
      });
    }
  }
};

export default DashboardController;