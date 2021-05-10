import Professor from '../entities/professor.entity';
import ProfessorRepository from '../repositories/professor.repository';
import { FilterQuery } from '../utils/database/database';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';

export default class ProfessorController {
  async obterPorId(id: number): Promise<Professor> {
    Validador.validarParametros([{ id }]);

    return await ProfessorRepository.obterPorId(id);
  }

  async obter(filtro: FilterQuery<Professor> = {}): Promise<Professor> {
    return await ProfessorRepository.obter(filtro);
  }

  // #pegabandeira
  async listar(filtro: FilterQuery<Professor> = {}): Promise<Professor[]> {
    return await ProfessorRepository.listar(filtro);
  }

  async listarTodos(): Promise<Professor[]> {
    let data = await ProfessorRepository.listarTodos();
    data = data.filter(data => data.tipo == 1)
    return data
  }

  // #pegabandeira
  async incluir(professor: Professor) {
    try{
      const { nome, email, senha, tipo } = professor;
      Validador.validarParametros([{ nome }, { email }, { senha }]);
      await Validador.validarEmailRepetido(email);
      const id = await ProfessorRepository.incluir(professor);
      return new Mensagem('Professor incluido com sucesso!', {
        id,
      });
    } catch (err) {
      throw err
    }
  }

  async alterar(id: number, professor: Professor) {
    const { nome, email, senha, tipo } = professor;

    Validador.validarParametros([{ id }, { nome }, { senha }]);
    Validador.validarAlterarEmail(id, email, tipo)

    await ProfessorRepository.alterar({ id }, professor);

    return new Mensagem('Professor alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number) {
    Validador.validarParametros([{ id }]);

    let tipo = (await new ProfessorController().obterPorId(id)).tipo;

    Validador.validarExcluirProf(id, tipo)

    await ProfessorRepository.excluir({ id });

    return new Mensagem('Professor excluido com sucesso!', {
      id,
    });
  }
}
