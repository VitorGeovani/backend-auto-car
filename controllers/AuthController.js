import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import Admin from '../models/Admin.js';

const AuthController = {
  loginUsuario: async (req, res) => {
    try {
      console.log('Tentativa de login de usuário:', req.body);
      const { email, senha } = req.body;
      
      // Validação básica
      if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
      }
      
      // Buscar usuário pelo email
      const usuario = await Usuario.buscarPorEmail(email);
      
      // Verificar se o usuário existe
      if (!usuario) {
        console.log('Usuário não encontrado:', email);
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }
      
      // Em produção, use bcrypt.compare
      const senhaCorreta = senha === usuario.senha;
      if (!senhaCorreta) {
        console.log('Senha incorreta para usuário:', email);
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }
      
      // Gerar token JWT
      const token = jwt.sign(
        { 
          id: usuario.id, 
          email: usuario.email, 
          nome: usuario.nome,
          tipo: 'usuario' 
        },
        process.env.JWT_SECRET || 'auto_car_secret_key',
        { expiresIn: '24h' }
      );
      
      console.log('Login de usuário bem-sucedido:', email);
      
      // Não retornar a senha
      const { senha: _, ...usuarioSemSenha } = usuario;
      
      // Enviar resposta de sucesso
      res.json({
        token,
        usuario: usuarioSemSenha
      });
    } catch (error) {
      console.error('Erro ao fazer login de usuário:', error);
      res.status(500).json({ erro: 'Erro interno ao processar login' });
    }
  },

  loginAdmin: async (req, res) => {
    try {
      console.log('Tentativa de login de admin:', req.body);
      const { email, senha } = req.body;
      
      // Validação básica
      if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
      }
      
      // Buscar admin pelo email
      const admin = await Admin.buscarPorEmail(email);
      
      // Verificar se o admin existe
      if (!admin) {
        console.log('Admin não encontrado:', email);
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }
      
      // Em produção, use bcrypt.compare
      const senhaCorreta = senha === admin.senha;
      if (!senhaCorreta) {
        console.log('Senha incorreta para admin:', email);
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }
      
      // Gerar token JWT
      const token = jwt.sign(
        { 
          id: admin.id, 
          email: admin.email, 
          nome: admin.nome,
          tipo: 'admin' 
        },
        process.env.JWT_SECRET || 'auto_car_secret_key',
        { expiresIn: '12h' }
      );
      
      console.log('Login de admin bem-sucedido:', email);
      
      // Não retornar a senha
      const { senha: _, ...adminSemSenha } = admin;
      
      // Enviar resposta de sucesso
      res.json({
        token,
        admin: adminSemSenha
      });
    } catch (error) {
      console.error('Erro ao fazer login de admin:', error);
      res.status(500).json({ erro: 'Erro interno ao processar login' });
    }
  },

  verificarToken: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ 
          valido: false, 
          mensagem: 'Token não fornecido' 
        });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'auto_car_secret_key');
      
      res.json({ 
        valido: true, 
        usuario: decoded,
        tipo: decoded.tipo
      });
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      res.status(401).json({ 
        valido: false, 
        mensagem: 'Token inválido ou expirado' 
      });
    }
  }
};

export default AuthController;