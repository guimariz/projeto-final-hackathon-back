import express, { NextFunction, Request, Response } from 'express';
import AlunoController from '../controllers/aluno.controller';
import Aluno from '../entities/aluno.entity';
import Mensagem from '../utils/mensagem';
import { TipoUsuario } from '../utils/tipo-usuario.enum';

const router = express.Router();

router.put('/aluno/:id', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { tipo, email } = req.uid;
    const mensagem: Mensagem = await new AlunoController().alterar(Number(id), req.body, tipo, email);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.put('/matricular/:idCurso', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { idCurso } = req.params;
    const { email } = req.uid;

    const mensagem: Mensagem = await new AlunoController().matricular(Number(idCurso), email);
    res.json(mensagem);   
  } catch (e) {
    next(e);
  }
});

router.delete('/aluno/:id', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const mensagem: Mensagem = await new AlunoController().excluir(Number(id), req.uid);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.get('/aluno/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const aluno: Aluno = await new AlunoController().obterPorId(Number(id));
    res.json(aluno);
  } catch (e) {
    next(e);
  }
});

router.get('/aluno/email/:email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params;
    const aluno: Aluno = await new AlunoController().obter({email: email });
    res.json(aluno);
  } catch (e) {
    next(e);
  }
});

router.get('/aluno', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { home } = req.query
    let alunos: Aluno[] = await new AlunoController().listar({tipo: TipoUsuario.ALUNO});

    if(home)
      alunos = alunos.slice(0, 5)

    res.json(alunos);
  } catch (e) {
    next(e);
  }
});

export default router;
