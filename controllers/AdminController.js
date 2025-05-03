import Admin from '../models/Admin.js';

const AdminController = {
  listar: async (req, res) => {
    try {
      const admins = await Admin.buscarTodos();
      res.json(admins);
    } catch (error) {
      console.error('Erro ao listar administradores:', error);
      res.status(500).json({ erro: 'Erro interno ao listar administradores' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, senha } = req.body;
      
      const admin = await Admin.buscarPorEmail(email);
      
      if (!admin || admin.senha !== senha) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      res.json({ mensagem: 'Login realizado com sucesso', admin });
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      res.status(500).json({ erro: 'Erro interno ao realizar login' });
    }
  }
};

export default AdminController;