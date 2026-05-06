import { IsEnum } from 'class-validator';
import { EstadoLaboral } from '../empleados.service';

export class CambiarEstadoDto {
  @IsEnum(EstadoLaboral)
  estado!: EstadoLaboral;
}