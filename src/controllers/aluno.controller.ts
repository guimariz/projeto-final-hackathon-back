import Aluno from '../entities/aluno.entity';
import AlunoRepository from '../repositories/aluno.repository';
import { FilterQuery } from '../utils/database/database';
import Exception from '../utils/exceptions/exception';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';

export default class AlunoController {
  async obterPorId(id: number): Promise<Aluno> {
    Validador.validarParametros([{ id }]);
    return await AlunoRepository.obterPorId(id);
  }

  async obter(filtro: FilterQuery<Aluno> = {}): Promise<Aluno> {
    return await AlunoRepository.obter(filtro);
  }

  // #pegabandeira
  async listar(filtro: FilterQuery<Aluno> = {}): Promise<Aluno[]> {
    return await AlunoRepository.listar(filtro);
  }

  async listarTodos(): Promise<Aluno[]> {
    let data = await AlunoRepository.listarTodos();
    data = data.filter(data => data.tipo == 2)
    return data 
  }

  // #pegabandeira
  async incluir(aluno: Aluno) {
    try {
      const { nome, formacao, idade, email, senha, tipo } = aluno;
      Validador.validarParametros([{ nome }, { formacao }, { idade }, { email }, { senha }]);
      await Validador.validarEmailRepetido(email);
      const id = await AlunoRepository.incluir(aluno);
      return new Mensagem('Aluno incluido com sucesso!', {
        id,
      });
    } catch(err) {
      throw err
    }
  }

  async alterar(id: number, aluno: Aluno) {
    const { nome, email, senha, tipo } = aluno;

    Validador.validarParametros([{ id }, { nome }, { senha }]);
    Validador.validarAlterarEmail(id, email, tipo)

    await AlunoRepository.alterar({ id }, aluno);

    return new Mensagem('Aluno alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number, dadosUsuario) {
    Validador.validarParametros([{ id }]);

    Validador.validarExcluirAluno(id, dadosUsuario)

    await AlunoRepository.excluir({ id });

    return new Mensagem('Aluno excluido com sucesso!', {
      id,
    });
  }
}
