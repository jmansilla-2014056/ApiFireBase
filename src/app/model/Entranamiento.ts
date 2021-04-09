import {Registro} from './Registro';
import {Recorrido} from './Recorrido';

export interface Entranamiento{
  fechahora?: string;
  recorridos?: Array<Recorrido>;
}
