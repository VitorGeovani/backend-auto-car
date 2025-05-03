import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  try {
    // Verificar se o header Authorization existe
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        erro: 'Token não fornecido' 
      });
    }
    
    // Formato esperado: Bearer {token}
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2) {
      return res.status(401).json({ 
        erro: 'Formato de token inválido' 
      });
    }
    
    const [scheme, token] = parts;
    
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ 
        erro: 'Formato de token inválido' 
      });
    }
    
    // Verificar e decodificar o token
    jwt.verify(
      token, 
      process.env.JWT_SECRET || 'auto_car_secret_key', 
      (err, decoded) => {
        if (err) {
          return res.status(401).json({ 
            erro: 'Token inválido ou expirado' 
          });
        }
        
        // Adicionar os dados do usuário decodificados à requisição
        req.usuario = decoded;
        
        // Verificar se é um admin
        req.isAdmin = decoded.tipo === 'admin';
        
        // Continuar com a requisição
        return next();
      }
    );
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({ 
      erro: 'Erro ao autenticar usuário' 
    });
  }
};

// Middleware específico para verificar se é admin
const adminMiddleware = (req, res, next) => {
  try {
    // Primeiro passa pela autenticação geral
    authMiddleware(req, res, () => {
      // Se não for admin, rejeita
      if (!req.isAdmin) {
        return res.status(403).json({ 
          erro: 'Acesso negado. Apenas administradores podem acessar este recurso' 
        });
      }
      
      // Se for admin, continua
      next();
    });
  } catch (error) {
    console.error('Erro no middleware de admin:', error);
    return res.status(500).json({
      erro: 'Erro ao verificar permissão de administrador'
    });
  }
};

export {
  authMiddleware,
  adminMiddleware
};