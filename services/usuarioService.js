import usuarioRepository from '../repository/usuarioRepository.js';
import bcrypt from 'bcrypt';

export default {
  /**
   * Lista todos os usuários com opção de paginação
   */
  listar: async (paginacao) => {
    try {
      return await usuarioRepository.buscarTodos(paginacao);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw new Error('Não foi possível listar os usuários');
    }
  },

  /**
   * Busca usuário por ID
   */
  buscarPorId: async (id) => {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }

      const usuario = await usuarioRepository.buscarPorId(id);
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }

      return usuario;
    } catch (error) {
      console.error(`Erro ao buscar usuário ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Busca usuário por email
   */
  buscarPorEmail: async (email) => {
    try {
      if (!email || !validarEmail(email)) {
        throw new Error('Email inválido');
      }

      return await usuarioRepository.buscarPorEmail(email);
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw error;
    }
  },

  /**
   * Busca usuários pelo nome (busca parcial)
   */
  buscarPorNome: async (nome) => {
    try {
      if (!nome || nome.length < 2) {
        throw new Error('Nome para busca deve ter pelo menos 2 caracteres');
      }

      return await usuarioRepository.buscarPorNome(nome);
    } catch (error) {
      console.error('Erro ao buscar usuários por nome:', error);
      throw error;
    }
  },

  /**
   * Conta o total de usuários
   */
  contar: async () => {
    try {
      return await usuarioRepository.contar();
    } catch (error) {
      console.error('Erro ao contar usuários:', error);
      throw error;
    }
  },

  /**
   * Cadastra um novo usuário
   */
  cadastrar: async (dados) => {
    try {
      // Validação dos dados
      validarDadosUsuario(dados);

      // Verificar se email já existe
      const usuarioExistente = await usuarioRepository.buscarPorEmail(dados.email);
      if (usuarioExistente) {
        throw new Error('Este email já está em uso');
      }

      // Hash da senha antes de salvar
      const senhaHash = await bcrypt.hash(dados.senha, 10);

      return await usuarioRepository.inserir({
        ...dados,
        senha: senhaHash
      });
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      throw error;
    }
  },

  /**
   * Atualiza dados de um usuário existente
   */
  atualizar: async (id, dados) => {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }

      // Verificar se o usuário existe
      const usuarioExistente = await usuarioRepository.buscarPorId(id);
      if (!usuarioExistente) {
        throw new Error('Usuário não encontrado');
      }

      // Validar dados
      if (!dados.nome || dados.nome.length < 3) {
        throw new Error('Nome deve ter pelo menos 3 caracteres');
      }

      if (dados.email && !validarEmail(dados.email)) {
        throw new Error('Email inválido');
      }

      // Se o email foi alterado, verificar se já existe
      if (dados.email && dados.email !== usuarioExistente.email) {
        const emailExistente = await usuarioRepository.buscarPorEmail(dados.email);
        if (emailExistente) {
          throw new Error('Este email já está em uso');
        }
      }

      return await usuarioRepository.atualizar(id, dados);
    } catch (error) {
      console.error(`Erro ao atualizar usuário ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Atualiza a senha do usuário
   */
  atualizarSenha: async (id, senhaAtual, novaSenha) => {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }

      if (!senhaAtual || !novaSenha) {
        throw new Error('Senha atual e nova senha são obrigatórias');
      }

      if (novaSenha.length < 6) {
        throw new Error('Nova senha deve ter pelo menos 6 caracteres');
      }

      // Buscar usuário com senha para verificação
      const usuario = await usuarioRepository.buscarPorEmail(id);
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar senha atual
      const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);
      if (!senhaCorreta) {
        throw new Error('Senha atual incorreta');
      }

      // Hash da nova senha
      const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

      return await usuarioRepository.atualizarSenha(id, novaSenhaHash);
    } catch (error) {
      console.error(`Erro ao atualizar senha do usuário ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Exclui um usuário
   */
  excluir: async (id) => {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }

      // Verificar se o usuário existe
      const usuario = await usuarioRepository.buscarPorId(id);
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }

      return await usuarioRepository.deletar(id);
    } catch (error) {
      console.error(`Erro ao excluir usuário ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Autentica um usuário (login)
   */
  autenticar: async (email, senha) => {
    try {
      if (!email || !senha) {
        throw new Error('Email e senha são obrigatórios');
      }

      // Buscar usuário pelo email (com senha)
      const usuario = await usuarioRepository.buscarPorEmail(email);
      if (!usuario) {
        throw new Error('Credenciais inválidas');
      }

      // Verificar senha
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        throw new Error('Credenciais inválidas');
      }

      // Não retornar a senha
      const { senha: _, ...usuarioSemSenha } = usuario;
      return usuarioSemSenha;
    } catch (error) {
      console.error('Erro na autenticação:', error);
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

/**
 * Função auxiliar para validar dados do usuário
 */
function validarDadosUsuario(dados) {
  if (!dados.nome || dados.nome.length < 3) {
    throw new Error('Nome deve ter pelo menos 3 caracteres');
  }

  if (!dados.email || !validarEmail(dados.email)) {
    throw new Error('Email inválido');
  }

  if (!dados.senha || dados.senha.length < 6) {
    throw new Error('Senha deve ter pelo menos 6 caracteres');
  }

  if (dados.telefone && !validarTelefone(dados.telefone)) {
    throw new Error('Telefone inválido');
  }
}

/**
 * Função auxiliar para validar telefone
 */
function validarTelefone(telefone) {
  // Aceita formatos como (99) 99999-9999 ou 99999999999
  const regex = /^(\(\d{2}\)\s?)?\d{4,5}-?\d{4}$/;
  return regex.test(telefone);
}