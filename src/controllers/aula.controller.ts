import Curso from '../entities/curso.entity';
import Aula from '../models/aula.model';
import cursoRepository from '../repositories/curso.repository';
import CursoRepository from '../repositories/curso.repository';
import { FilterQuery } from '../utils/database/database';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';

export default class AulaController {
  async obterPorId(id: number, idCurso: number): Promise<Aula> {
    Validador.validarParametros([{ id }, { idCurso }]);
    const curso = await CursoRepository.obterPorId(idCurso);
    return curso.aulas.find((a) => a.id === id);
  }

  async listar(idCurso: number): Promise<Aula[]> {
    Validador.validarParametros([{ idCurso }]);
    const curso = await CursoRepository.obterPorId(idCurso);
    return curso.aulas;
  }  

  async listarTodos(filtro: FilterQuery<Curso> = {}): Promise<Curso[]> {
    const data = await CursoRepository.listar(filtro);

    let aulas;
    if(data.length)
      aulas = data.map(i => i.aulas)

    return aulas
  }

  async contar(): Promise<number> {
    let x = 0;
    (await cursoRepository.listar()).forEach(i => x += i.aulas.length)
    return x
    // return (await cursoRepository.listar()).reduce((acc, value) => acc += value.aulas.length, 0)

  }

  async incluir(aula: Aula) {

    const { nome, duracao, topicos, idCurso } = aula;

    Validador.validarParametros([{ nome }, { duracao }, { topicos }, { idCurso }]);

    await Validador.validarNomeAulaRepetido(nome, idCurso)

    const curso = await CursoRepository.obterPorId(Number(idCurso));

    aula.id = 1;
    
    if(curso.aulas.length) {
      const idAnterior = curso.aulas[curso.aulas.length - 1].id;
      aula.id = idAnterior ? idAnterior + 1 : 1;
    }
  

    curso.aulas.push(aula);
    await CursoRepository.alterar({ id: idCurso }, curso);

    return new Mensagem('Aula incluido com sucesso!', {
      id: aula.id,
      idCurso,
    });
  }

  async alterar(id: number, aula: Aula) {
    const { nome, duracao, topicos, idCurso } = aula;
    Validador.validarParametros([{ id }, { idCurso }, { nome }, { duracao }, { topicos }]);

    const curso = await CursoRepository.obterPorId(idCurso);

    curso.aulas.map((a) => {
      if (a.id === id) {
        Object.keys(aula).forEach((k) => {
          a[k] = aula[k];
        });
      }
    });

    await CursoRepository.alterar({ id: idCurso }, curso);

    return new Mensagem('Aula alterado com sucesso!', {
      id,
      idCurso,
    });
  }

  async excluir(id: number, idCurso: number) {
    Validador.validarParametros([{ id }, { idCurso }]);

    const curso = await CursoRepository.obterPorId(idCurso);

    curso.aulas = curso.aulas.filter((a) => a.id !== id);

    await CursoRepository.alterar({ id: idCurso }, curso);

    return new Mensagem('Aula excluido com sucesso!');
  }
}
