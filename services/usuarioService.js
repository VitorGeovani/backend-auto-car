import usuarioRepository from '../repository/usuarioRepository.js';

export default {
  listar: () => usuarioRepository.buscarTodos(),

  cadastrar: (dados) => usuarioRepository.inserir(dados),

  buscarPorId: (id) => usuarioRepository.buscarPorId(id)
};