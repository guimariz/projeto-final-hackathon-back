import express, { NextFunction, Request, Response } from 'express';
import ProfessorController from '../controllers/professor.controller';
import Professor from '../entities/professor.entity';
import Mensagem from '../utils/mensagem';

const router = express.Router();

router.put('/professor/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const mensagem: Mensagem = await new ProfessorController().alterar(Number(id), req.body);
    res.json(mensagem);
  } catch (e) { 
    next(e);
  }
});

router.delete('/professor/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const mensagem: Mensagem = await new ProfessorController().excluir(Number(id));
    res.json(mensagem);
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
    console.log(req.uid)
    let professores: Professor[] = await new ProfessorController().listarTodos();
    professores.forEach(data => delete data.senha)
    res.json(professores);
  } catch (e) {
    next(e);
  }
});

export default router;
