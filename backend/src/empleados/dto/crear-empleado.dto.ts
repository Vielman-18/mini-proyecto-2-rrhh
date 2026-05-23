import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsNumber,
  IsInt,
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

  
  @IsEmail()
  email!: string;

  @Type(() => Number)
  @IsNumber()
  salario!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  departamento_id!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  puesto_id!: number;
}