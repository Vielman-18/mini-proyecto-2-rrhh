import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CrearEmpleadoDto {
  @IsString()
  @IsNotEmpty()
  nombres!: string;

  @IsString()
  @IsNotEmpty()
  apellidos!: string;

  @IsString()
  @IsNotEmpty()
  dpi!: string;

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

  @Type(() => Number)
  @IsNumber()
  salario!: number;

  @IsOptional()
  @IsString()
  cargo?: string;

  @IsOptional()
  @IsString()
  departamento?: string;
}