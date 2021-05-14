import Aula from '../models/aula.model';
import Nota from '../models/nota.model';
import Entity from './entity';

export default class Curso extends Entity {
  nome: string;
  descricao: string;
  idProfessor?: number;
  aulas?: Aula[];
  notas?: Nota[];

  constructor() {
    super();
  }
}
