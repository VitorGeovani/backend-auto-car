import adminRepository from '../repository/adminRepository.js';
import bcrypt from 'bcrypt';

export default {
  /**
   * Lista todos os administradores
   */
  listar: async () => {
    try {
      return await adminRepository.buscarTodos();
    } catch (error) {
      console.error('Erro ao listar administradores:', error);
      throw new Error('Não foi possível listar os administradores');
    }
  },

  /**
   * Realiza login do administrador
   */
  login: async (email, senha) => {
    try {
      if (!email || !senha) {
        throw new Error('Email e senha são obrigatórios');
      }

      // Buscar admin por email
      const admin = await adminRepository.buscarPorEmail(email);
      if (!admin) {
        throw new Error('Credenciais inválidas');
      }

      // Verificar senha - assumindo que a senha está hasheada no banco
      const senhaCorreta = await bcrypt.compare(senha, admin.senha);
      if (!senhaCorreta) {
        throw new Error('Credenciais inválidas');
      }

      // Não retornar a senha
      const { senha: _, ...adminSemSenha } = admin;
      return adminSemSenha;
    } catch (error) {
      console.error('Erro durante login:', error);
      throw error;
    }
  },

  /**
   * Busca um administrador por ID
   */
  buscarPorId: async (id) => {
    try {
      if (!id) {
        throw new Error('ID é obrigatório');
      }

      const admin = await adminRepository.buscarPorId(id);
      if (!admin) {
        throw new Error('Administrador não encontrado');
      }

      return admin;
    } catch (error) {
      console.error(`Erro ao buscar administrador ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Busca um administrador por email
   */
  buscarPorEmail: async (email) => {
    try {
      if (!email || !validarEmail(email)) {
        throw new Error('Email inválido');
      }

      return await adminRepository.buscarPorEmail(email);
    } catch (error) {
      console.error('Erro ao buscar administrador por email:', error);
      throw error;
    }
  },

  /**
   * Cria um novo administrador
   */
  criar: async (adminData) => {
    try {
      // Validar dados
      if (!adminData.nome || adminData.nome.length < 3) {
        throw new Error('Nome deve ter pelo menos 3 caracteres');
      }

      if (!adminData.email || !validarEmail(adminData.email)) {
        throw new Error('Email inválido');
      }

      if (!adminData.senha || adminData.senha.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }

      // Verificar se email já existe
      const adminExistente = await adminRepository.buscarPorEmail(adminData.email);
      if (adminExistente) {
        throw new Error('Email já cadastrado');
      }

      // Hashear a senha
      const senhaHash = await bcrypt.hash(adminData.senha, 10);
      
      // Criar admin com senha hasheada
      return await adminRepository.criar({
        ...adminData,
        senha: senhaHash
      });
    } catch (error) {
      console.error('Erro ao criar administrador:', error);
      throw error;
    }
  },

  /**
   * Atualiza um administrador existente
   */
  atualizar: async (id, adminData) => {
    try {
      // Validar ID
      if (!id) {
        throw new Error('ID é obrigatório');
      }

      // Verificar se o admin existe
      const adminExistente = await adminRepository.buscarPorId(id);
      if (!adminExistente) {
        throw new Error('Administrador não encontrado');
      }

      // Validar dados
      if (adminData.nome && adminData.nome.length < 3) {
        throw new Error('Nome deve ter pelo menos 3 caracteres');
      }

      if (adminData.email) {
        if (!validarEmail(adminData.email)) {
          throw new Error('Email inválido');
        }

        // Se o email for diferente, verificar se já existe
        if (adminData.email !== adminExistente.email) {
          const emailEmUso = await adminRepository.buscarPorEmail(adminData.email);
          if (emailEmUso) {
            throw new Error('Email já está em uso');
          }
        }
      }

      return await adminRepository.atualizar(id, adminData);
    } catch (error) {
      console.error(`Erro ao atualizar administrador ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Atualiza a senha de um administrador
   */
  atualizarSenha: async (id, senhaAtual, novaSenha) => {
    try {
      if (!id) {
        throw new Error('ID é obrigatório');
      }

      if (!senhaAtual || !novaSenha) {
        throw new Error('Senha atual e nova senha são obrigatórias');
      }

      if (novaSenha.length < 6) {
        throw new Error('Nova senha deve ter pelo menos 6 caracteres');
      }

      // Buscar admin para verificar senha atual
      const admin = await adminRepository.buscarPorEmail(id);
      if (!admin) {
        throw new Error('Administrador não encontrado');
      }

      // Verificar senha atual
      const senhaCorreta = await bcrypt.compare(senhaAtual, admin.senha);
      if (!senhaCorreta) {
        throw new Error('Senha atual incorreta');
      }

      // Hashear a nova senha
      const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

      // Atualizar a senha
      return await adminRepository.atualizarSenha(id, novaSenhaHash);
    } catch (error) {
      console.error(`Erro ao atualizar senha do administrador ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Exclui um administrador
   */
  excluir: async (id) => {
    try {
      if (!id) {
        throw new Error('ID é obrigatório');
      }

      // Verificar se o admin existe
      const admin = await adminRepository.buscarPorId(id);
      if (!admin) {
        throw new Error('Administrador não encontrado');
      }

      return await adminRepository.deletar(id);
    } catch (error) {
      console.error(`Erro ao excluir administrador ID ${id}:`, error);
      throw error;
    }
  }
};

/**
 * Função auxiliar para validar email
 */
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}