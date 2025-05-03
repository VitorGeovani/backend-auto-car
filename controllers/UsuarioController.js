import Usuario from '../models/Usuario.js';

const UsuarioController = {
  listar: async (req, res) => {
    try {
      const usuarios = await Usuario.buscarTodos();
      res.json(usuarios);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ erro: 'Erro interno ao listar usuários' });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.buscarPorId(id);
      
      if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      }
      
      res.json(usuario);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ erro: 'Erro interno ao buscar usuário' });
    }
  },

  cadastrar: async (req, res) => {
    try {
      const { nome, email, telefone, senha } = req.body;
      
      // Validação básica
      if (!nome || !email || !senha) {
        return res.status(400).json({ 
          mensagem: 'Dados incompletos. Nome, email e senha são obrigatórios.' 
        });
      }
      
      // Verificar se já existe usuário com este email
      const usuarioExistente = await Usuario.buscarPorEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ 
          mensagem: 'Este email já está em uso.'
        });
      }
      
      const novoUsuario = await Usuario.criar({ nome, email, telefone, senha });
      
      res.status(201).json({ 
        mensagem: 'Usuário cadastrado com sucesso', 
        id: novoUsuario.id 
      });
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      res.status(500).json({ erro: 'Erro interno ao cadastrar usuário' });
    }
  },

  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, email, telefone } = req.body;
      
      // Verificar se o usuário existe
      const usuarioExistente = await Usuario.buscarPorId(id);
      if (!usuarioExistente) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      }
      
      // Verificar se o email já está em uso por outro usuário
      if (email && email !== usuarioExistente.email) {
        const emailEmUso = await Usuario.buscarPorEmail(email);
        if (emailEmUso) {
          return res.status(400).json({ mensagem: 'Este email já está em uso.' });
        }
      }
      
      const usuarioAtualizado = await Usuario.atualizar(id, { 
        nome: nome || usuarioExistente.nome, 
        email: email || usuarioExistente.email, 
        telefone: telefone || usuarioExistente.telefone 
      });
      
      res.json({ 
        mensagem: 'Usuário atualizado com sucesso', 
        usuario: usuarioAtualizado 
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ erro: 'Erro interno ao atualizar usuário' });
    }
  },

  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verificar se o usuário existe
      const usuario = await Usuario.buscarPorId(id);
      if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      }
      
      await Usuario.deletar(id);
      
      res.json({ mensagem: 'Usuário removido com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ erro: 'Erro interno ao deletar usuário' });
    }
  }
};

export default UsuarioController;