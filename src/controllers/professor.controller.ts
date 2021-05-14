import Professor from '../entities/professor.entity';
import ProfessorRepository from '../repositories/professor.repository';
import { FilterQuery } from '../utils/database/database';
import Mensagem from '../utils/mensagem';
import { TipoUsuario } from '../utils/tipo-usuario.enum';
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

  async contar(): Promise<number> {
    const filtro = { tipo: TipoUsuario.PROFESSOR }
    return await ProfessorRepository.contar(filtro);
  }

  // #pegabandeira
  async incluir(professor: Professor) {
    try{
      const { nome, email, senha } = professor;
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

  async alterar(id: number, professor: Professor, tipo: any) {
    const { nome, email, senha } = professor;

    Validador.validarParametros([{ id }, { nome }, { senha }]);
    Validador.validarAlterarEmail(id, email, tipo)

    await ProfessorRepository.alterar({ id }, professor);

    return new Mensagem('Professor alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number, tipo: any) {

    Validador.validarParametros([{ id }]);

    await Validador.validarExcluirProf(id, tipo)

    await ProfessorRepository.excluir({ id });

    return new Mensagem('Professor excluido com sucesso!', {
      id,
    });
  }
}
