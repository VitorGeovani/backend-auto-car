import vendaRepository from '../repository/vendaRepository.js';

export default {
  listar: () => vendaRepository.buscarTodas(),

  registrar: (dados) => vendaRepository.inserir(dados)
};