import express, { NextFunction, Request, Response } from 'express';
import CursoController from '../controllers/curso.controller';
import Curso from '../entities/curso.entity';
import Mensagem from '../utils/mensagem';

const router = express.Router();

router.post('/curso', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mensagem: Mensagem = await new CursoController().incluir(req.body);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
})

router.put('/curso/nota/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idCurso, nota, idAluno, tipo } = req.body
    const mensagem: Mensagem = await new CursoController().incluirNota(idCurso, nota, idAluno, tipo);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.put('/curso/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const mensagem: Mensagem = await new CursoController().alterar(Number(id), req.body);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.delete('/curso/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const mensagem: Mensagem = await new CursoController().excluir(Number(id));
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.get('/curso/qtd', async (req: any, res: Response, next: NextFunction) => {
  try {
    let qtd = await new CursoController().contar();
    res.json(qtd);
  } catch (e) {
    next(e);
  }
});

router.get('/curso/prof/:id', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = await new CursoController().listar({ idProfessor: Number(id) });
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/curso/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const curso: Curso = await new CursoController().obterPorId(Number(id));
    res.json(curso);
  } catch (e) {
    next(e);
  }
});

router.get('/curso', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cursos: Curso[] = await new CursoController().listar({});
    res.json(cursos);
  } catch (e) {
    next(e);
  }
});
router.get('/home/curso', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cursos: Curso[] = await new CursoController().listar({});
    let data;
    if(cursos)
      data = cursos.slice(0, 5);
    
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
