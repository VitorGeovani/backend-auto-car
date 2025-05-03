import adminRepository from '../repository/adminRepository.js';

export default {
  listar: () => adminRepository.buscarTodos(),

  login: (email, senha) => adminRepository.buscarPorCredenciais(email, senha)
};