import categoriaRepository from '../repository/categoriaRepository.js';

export default {
  listar: () => categoriaRepository.buscarTodas(),

  criar: (dados) => categoriaRepository.inserir(dados),

  atualizar: (id, dados) => categoriaRepository.atualizar(id, dados),

  deletar: (id) => categoriaRepository.deletar(id)
};