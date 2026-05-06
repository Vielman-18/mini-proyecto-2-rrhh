import {
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ActualizarEmpleadoDto {
  @IsOptional()
  @IsString()
  nombres?: string;

  @IsOptional()
  @IsString()
  apellidos?: string;

  @IsOptional()
  @IsString()
  dpi?: string;

  @IsOptional()
  @IsString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salario?: number;

  @IsOptional()
  @IsString()
  cargo?: string;

  @IsOptional()
  @IsString()
  departamento?: string;
}