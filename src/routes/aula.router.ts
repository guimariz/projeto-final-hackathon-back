import express, { NextFunction, Request, Response } from 'express';
import AulaController from '../controllers/aula.controller';
import CursoController from '../controllers/curso.controller';
import Curso from '../entities/curso.entity';
import Aula from '../models/aula.model';
import Mensagem from '../utils/mensagem';

const router = express.Router();

router.post('/aula', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mensagem: Mensagem = await new AulaController().incluir(req.body);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.put('/aula/:id', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { tipo } = req.uid
    const mensagem: Mensagem = await new AulaController().alterar(Number(id), req.body, tipo);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.delete('/aula/:id', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { idCurso } = req.query;
    const { tipo } = req.uid
    const aulas: Mensagem = await new AulaController().excluir(Number(id), Number(idCurso), tipo);
    res.json(aulas);
  } catch (e) {
    next(e);
  }
});

router.get('/aula/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { idCurso } = req.query;
    const aula: Aula = await new AulaController().obterPorId(Number(id), Number(idCurso));
    res.json(aula);
  } catch (e) {
    next(e);
  }
});

router.get('/aula', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idCurso } = req.query;
    const aulas: Aula[] = await new AulaController().listar(Number(idCurso));
    res.json(aulas);

  } catch (e) {
    next(e);
  }
});

router.get('/aulas', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { home } = req.query
    let aulas = await new AulaController().listarTodos({});

    if(home && aulas && aulas.length)
      aulas = aulas.slice(0, 5)

    res.json(aulas);
   
  } catch (e) {
    next(e);
  }
});

export default router;
