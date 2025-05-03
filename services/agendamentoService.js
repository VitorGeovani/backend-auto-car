import agendamentoRepository from '../repository/agendamentoRepository.js';

export default {
  listar: () => agendamentoRepository.buscarTodos(),

  criar: (dados) => agendamentoRepository.inserir(dados),

  atualizarStatus: (id, status) => agendamentoRepository.atualizarStatus(id, status),

  deletar: (id) => agendamentoRepository.deletar(id)
};