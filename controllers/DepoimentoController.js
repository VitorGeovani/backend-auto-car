import Depoimento from '../models/Depoimento.js';

const DepoimentoController = {
  // Método para listar depoimentos (público ou admin)
  listar: async (req, res) => {
    try {
      // Se a requisição vier com token de admin, retorna todos
      // Caso contrário, retorna apenas aprovados
      const isAdmin = req.path.includes('/admin');
      const depoimentos = await Depoimento.buscarTodos(isAdmin ? null : true);
      res.json(depoimentos);
    } catch (error) {
      console.error('Erro ao listar depoimentos:', error);
      res.status(500).json({ erro: 'Erro interno ao listar depoimentos' });
    }
  },

  // Método específico para listar todos os depoimentos (apenas admin)
  listarAdmin: async (req, res) => {
    try {
      // Verificação extra de segurança
      if (!req.usuario || !req.isAdmin) {
        return res.status(403).json({ erro: 'Acesso não autorizado' });
      }
      
      const depoimentos = await Depoimento.buscarTodos(null); // null para trazer todos
      res.json(depoimentos);
    } catch (error) {
      console.error('Erro ao listar depoimentos para admin:', error);
      res.status(500).json({ erro: 'Erro interno ao listar depoimentos' });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const depoimento = await Depoimento.buscarPorId(id);
      
      if (!depoimento) {
        return res.status(404).json({ erro: 'Depoimento não encontrado' });
      }
      
      res.json(depoimento);
    } catch (error) {
      console.error('Erro ao buscar depoimento:', error);
      res.status(500).json({ erro: 'Erro interno ao buscar depoimento' });
    }
  },

  criar: async (req, res) => {
    try {
      const { nome_cliente, email, cidade, texto, avaliacao } = req.body;
      
      // Validação básica
      if (!nome_cliente || !texto) {
        return res.status(400).json({ 
          erro: 'Nome e depoimento são campos obrigatórios.' 
        });
      }
      
      // Criar com status pendente por padrão
      const resultado = await Depoimento.criar({ 
        nome_cliente, 
        email, 
        cidade,
        texto, 
        avaliacao: parseInt(avaliacao) || 5,
        aprovado: false,
        data: new Date()
      });
      
      res.status(201).json({ 
        mensagem: 'Depoimento registrado com sucesso e será avaliado pela nossa equipe.',
        id: resultado.insertId 
      });
    } catch (error) {
      console.error('Erro ao criar depoimento:', error);
      res.status(500).json({ erro: 'Erro interno ao criar depoimento' });
    }
  },

  atualizar: async (req, res) => {
    try {
      // Verificar se é admin
      if (!req.usuario || !req.isAdmin) {
        return res.status(403).json({ erro: 'Acesso não autorizado' });
      }
      
      const { id } = req.params;
      const { aprovado } = req.body;
      
      // Verificar se o depoimento existe
      const depoimento = await Depoimento.buscarPorId(id);
      if (!depoimento) {
        return res.status(404).json({ erro: 'Depoimento não encontrado' });
      }
      
      await Depoimento.atualizar(id, { aprovado: !!aprovado });
      res.json({ 
        mensagem: 'Status do depoimento atualizado com sucesso',
        aprovado: !!aprovado
      });
    } catch (error) {
      console.error('Erro ao atualizar depoimento:', error);
      res.status(500).json({ erro: 'Erro interno ao atualizar depoimento' });
    }
  },

  excluir: async (req, res) => {
    try {
      // Verificar se é admin
      if (!req.usuario || !req.isAdmin) {
        return res.status(403).json({ erro: 'Acesso não autorizado' });
      }
      
      const { id } = req.params;
      
      // Verificar se o depoimento existe
      const depoimento = await Depoimento.buscarPorId(id);
      if (!depoimento) {
        return res.status(404).json({ erro: 'Depoimento não encontrado' });
      }
      
      await Depoimento.excluir(id);
      res.json({ mensagem: 'Depoimento excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir depoimento:', error);
      res.status(500).json({ erro: 'Erro interno ao excluir depoimento' });
    }
  }
};

export default DepoimentoController;