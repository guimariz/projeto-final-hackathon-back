import Curso from '../entities/curso.entity';
import CursoRepository from '../repositories/curso.repository';
import { FilterQuery } from '../utils/database/database';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';

export default class CursoController {
  async obterPorId(id: number): Promise<Curso> {
    Validador.validarParametros([{ id }]);
    return await CursoRepository.obterPorId(id);
  }

  async obter(filtro: FilterQuery<Curso> = {}): Promise<Curso> {
    return await CursoRepository.obter(filtro);
  }

  async listar(filtro: FilterQuery<Curso> = {}): Promise<Curso[]> {
    return await CursoRepository.listar(filtro);
  }

  async contar(): Promise<number> {
    const filtro = {}
    return await CursoRepository.contar(filtro);
  }


  async incluir(curso: Curso) {
    try {
      
      const { nome, descricao, aulas, idProfessor } = curso;
      Validador.validarParametros([{ nome }, { descricao }, { aulas }, { idProfessor }]);
      
      await Validador.validarNomeRepetido(nome);

      await Validador.validarIsProf(idProfessor);

      let data: any= {
        nome: curso.nome,
        descricao: curso.descricao,
        idProfessor: curso.idProfessor,
        aulas: curso.aulas,
        notas: []
      }

      const id = await CursoRepository.incluir(data);
    
      return new Mensagem('Aula incluido com sucesso!', {
        id,
      });
    } catch (error) {
      throw error
    }
  }

  async alterar(id: number, curso: Curso) {
    const { nome, descricao, aulas, idProfessor } = curso;
    Validador.validarParametros([{ id }, { nome }, { descricao }, { aulas }, { idProfessor }]);

    await CursoRepository.alterar({ id }, curso);

    return new Mensagem('Aula alterado com sucesso!', {
      id,
    });
  }

  async incluirNota(idCurso, nota, idAluno, tipo) {

    Validador.validarIncluirNota(tipo)

    const newNota = {
      nota: nota,
      idAluno: idAluno
    }

    const curso : Curso = await new CursoController().obterPorId(idCurso);

    let resultado = curso.notas.find(i => i.idAluno === idAluno)

    if(resultado) {
      resultado.nota = nota;
    } else {
      curso.notas.push(newNota)
    }

    const id = await CursoRepository.alterar({ id: idCurso }, curso);

    return new Mensagem('Nota atribuída com sucesso!', {
      id: id, 
    });
  }

  async excluir(id: number) {
    Validador.validarParametros([{ id }]);

    await CursoRepository.excluir({ id });

    return new Mensagem('Curso excluido com sucesso!', {
      id,
    });
  }
}
