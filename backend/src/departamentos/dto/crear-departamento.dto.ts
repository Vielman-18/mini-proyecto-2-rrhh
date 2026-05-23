import {IsInt, IsString, IsOptional, IsNumber} from 'class-validator';
import { Type } from 'class-transformer';


export class CrearDepartamentoDto {
  @IsString()
  nombre!: string;

  @IsString()
  descripcion! : string;

  @IsInt()
  @Type(() => Number)
  creado_por!: number;

  @IsOptional()
  @IsString()
  estado! : string;
}