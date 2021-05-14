import express, { NextFunction, Request, Response } from 'express';
import AlunoController from '../controllers/aluno.controller';
import Aluno from '../entities/aluno.entity';
import Mensagem from '../utils/mensagem';
import { TipoUsuario } from '../utils/tipo-usuario.enum';

const router = express.Router();

router.put('/aluno/:id', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { tipo } = req.uid;
    const mensagem: Mensagem = await new AlunoController().alterar(Number(id), req.body, tipo);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.put('/matricular/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { idCurso } = req.body;

    const mensagem: Mensagem = await new AlunoController().matricular(Number(id), idCurso);
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

router.get('/aluno/qtd', async (req: any, res: Response, next: NextFunction) => {
  try {
    let qtd = await new AlunoController().contar();
    res.json(qtd);
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

router.get('/aluno/nome/:nome', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nome } = req.params;
    const aluno: Aluno = await new AlunoController().obter({nome: nome });
    res.json(aluno);
  } catch (e) {
    next(e);
  }
});

router.get('/aluno', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alunos: Aluno[] = await new AlunoController().listar({tipo: TipoUsuario.ALUNO});
    res.json(alunos);
  } catch (e) {
    next(e);
  }
});

router.get('/home/aluno', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alunos: Aluno[] = await new AlunoController().listar({tipo: TipoUsuario.ALUNO});
    
    let data;
    if(alunos)
      data = alunos.slice(0, 5);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
