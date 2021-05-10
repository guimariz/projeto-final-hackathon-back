import bcrypt from 'bcryptjs';
import AlunoController from '../controllers/aluno.controller';
import CursoController from '../controllers/curso.controller';
import ProfessorController from '../controllers/professor.controller';
import alunoRepository from '../repositories/aluno.repository';
import professorRepository from '../repositories/professor.repository';
import usuarioRepository from '../repositories/usuario.repository';
import BusinessException from '../utils/exceptions/business.exception';
import UnauthorizedException from '../utils/exceptions/unauthorized.exception';
import Exception from './exceptions/exception';
import { TipoUsuario } from './tipo-usuario.enum';


export const Validador = {
  validarParametros: (parametros: any[]) => {
    if (!parametros) return true;

    const parametrosInvalidos = parametros
      .filter((p) => {
        const attr = Object.keys(p)[0];
        return (
          p[attr] === null ||
          p[attr] === undefined ||
          (typeof p[attr] === 'number' && isNaN(p[attr])) ||
          (typeof p[attr] === 'string' && p[attr] === '')
        );
      })
      .map((p) => Object.keys(p)[0]);

    if (parametrosInvalidos.length) {
      throw new BusinessException(`Os seguintes parametros são obrigatórios: ${parametrosInvalidos.join(', ')}`);
    }
    return true;
  },

  validarSenha: (senha: string, senhaAtual: string) => {
    const isValid = bcrypt.compareSync(senha, senhaAtual);

    if (!isValid) {
      throw new UnauthorizedException('Usuário ou senha inválida.');
    }
  },  

  criptografarSenha: (senha: string): string => {
    return bcrypt.hashSync(senha, 8);
  },

  validarEmailRepetido: async (email: string) => {
    try {
      const data = await usuarioRepository.listar({ email: email });
      if(data.length) {
        throw new Exception('E-mail já cadastrado.');
      }
    } catch (err) {
      throw err
    }
  },
  
  validarNomeRepetido: (nome: string) => {
    if(new CursoController().listar({nome})) {
      throw new Exception('Nome já cadastrado.') 
    }
  },

  validarAlterarEmail: (id: number, email: string, tipo: number) => {
      if(tipo == 1) {
        let validaEmail = new ProfessorController().obterPorId(id);
        validaEmail.then(res => {
          if(email == res.email) {
            throw new Exception('E-mail inválido, digite o mesmo e-mail anterior.')
          }
        })
      } else {
        let validaEmail = new AlunoController().obterPorId(id);
        
        validaEmail.then(res => {
          if(email == res.email) {
            throw new Exception('E-mail inválido, digite o mesmo e-mail anterior.')
          }
        })    
      }
  },

  validarExcluirAluno: (id:number, dadosUsuario: any) => {

    if(dadosUsuario.tipo != TipoUsuario.PROFESSOR){
      throw new Exception('Não tem permissão para excluir.')
    }

    new AlunoController().obterPorId(id).then(data => {
      if(data.cursos) {
        throw new Exception('Aluno não pode ser excluído.')
      }
    })
    
  },

  validarExcluirProf: async (id: number, dadosUsuario: any) => {

    if(dadosUsuario.tipo != TipoUsuario.PROFESSOR){
      throw new Exception('Não tem permissão para excluir.')
    }

    const data = await new CursoController().listar({idProfessor: id})

    if(data.length){
      throw new Exception('Não é possível excluir com cursos vinculados.')
    }

  }

};
