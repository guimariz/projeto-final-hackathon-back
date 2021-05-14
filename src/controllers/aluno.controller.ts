import Aluno from '../entities/aluno.entity';
import AlunoRepository from '../repositories/aluno.repository';
import { FilterQuery } from '../utils/database/database';
import Mensagem from '../utils/mensagem';
import { TipoUsuario } from '../utils/tipo-usuario.enum';
import { Validador } from '../utils/utils';
import CursoController from './curso.controller';

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
    const data = await AlunoRepository.listar(filtro);
    data.forEach(i => delete i.senha)
    return data
  }

  async contar(): Promise<number> {
    const filtro = { tipo: TipoUsuario.ALUNO }
    return await AlunoRepository.contar(filtro);
  }

  // #pegabandeira
  async incluir(aluno: Aluno) {
    try {
      const { nome, formacao, idade, email, senha } = aluno;
      Validador.validarParametros([{ nome }, { formacao }, { idade }, { email }, { senha }]);
      await Validador.validarEmailRepetido(email);
      
      let data: any= {
        email: aluno.email,
        senha: aluno.senha,
        nome: aluno.nome,
        tipo: aluno.tipo,
        idade: aluno.idade,
        formacao: aluno.formacao,
        cursos: []
      }

      const id = await AlunoRepository.incluir(data);

      
      return new Mensagem('Aluno incluido com sucesso!', {
        id,
      });
    } catch(err) {
      throw err
    }
  }

  async matricular(idCurso: number, email: string) {

    const curso = await new CursoController().obterPorId(Number(idCurso))
    const getAluno = await new AlunoController().obter({ email })

      console.log(getAluno)
    const data : any = getAluno;

    let mensagem = 'Aluno matriculado com sucesso!';

    let matriculado = true;

    if(getAluno.cursos.find(i => i.id === Number(idCurso) )){
      data.cursos = getAluno.cursos.filter(i => i.id !== (Number(idCurso)))
      mensagem = 'Aluno desmatriculado com sucesso!';
      matriculado = false;
    } else {
      data.cursos.push(curso)
    }

    await AlunoRepository.alterar({ id: getAluno.id }, data);

    return new Mensagem(mensagem, { matriculado });
  }

  async alterar(id: number, aluno: Aluno, tipo: any) {
    const { nome, email, senha } = aluno;

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
