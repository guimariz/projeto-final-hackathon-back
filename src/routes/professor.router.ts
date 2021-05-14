import express, { NextFunction, Request, Response } from 'express';
import ProfessorController from '../controllers/professor.controller';
import Professor from '../entities/professor.entity';
import Mensagem from '../utils/mensagem';
import { TipoUsuario } from '../utils/tipo-usuario.enum';

const router = express.Router();

router.put('/professor/:id', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { tipo } = req.uid;
    const mensagem: Mensagem = await new ProfessorController().alterar(Number(id), req.body, tipo);
    res.json(mensagem);
  } catch (e) { 
    next(e);
  }
});

router.delete('/professor/:id', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { tipo } = req.uid
    const mensagem: Mensagem = await new ProfessorController().excluir(Number(id), tipo);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.get('/professor/qtd', async (req: any, res: Response, next: NextFunction) => {
  try {
    let qtd = await new ProfessorController().contar();

    res.json(qtd);
  } catch (e) {
    next(e);
  }
});

router.get('/professor/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const professor: Professor = await new ProfessorController().obterPorId(Number(id));
    res.json(professor);
  } catch (e) {
    next(e);
  }
});

router.get('/professor', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { home } = req.query;
    let professores: Professor[] = await new ProfessorController().listar({tipo: TipoUsuario.PROFESSOR});
    
    if(home)
      professores = professores.slice(0, 5)

    res.json(professores);
  } catch (e) {
    next(e);
  }
});

export default router;
