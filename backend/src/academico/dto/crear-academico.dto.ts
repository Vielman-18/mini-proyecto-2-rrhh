import { IsInt, IsString, IsOptional, IsDateString } from 'class-validator';

export class CrearAcademicoDto {
  @IsInt()
  empleado_id!: number;

  @IsString()
  titulo!: string;

  @IsString()
  institucion!: string;

  @IsOptional()
  @IsDateString()
  fecha_graduacion?: string;
}