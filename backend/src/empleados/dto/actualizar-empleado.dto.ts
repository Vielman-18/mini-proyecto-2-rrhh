import {
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
  IsInt,
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

  
  @IsEmail()
  email!: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salario?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  departamento_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  puesto_id?: number;
}