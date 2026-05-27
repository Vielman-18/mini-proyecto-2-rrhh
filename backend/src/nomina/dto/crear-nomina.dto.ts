import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoNomina } from './cambiar-estado.dto';

export enum TipoPeriodo {
  MENSUAL = 'mensual',
  QUINCENAL = 'quincenal',
}

export class CrearNominaDto {
  @ApiProperty({
    example: 'mensual',
    enum: TipoPeriodo,
    description: 'Tipo de nómina a generar',
  })
  @IsEnum(TipoPeriodo)
  tipo_periodo!: TipoPeriodo;
  

  @ApiPropertyOptional({
    example: '2026-01-01',
    description: 'Fecha de inicio del rango de generación (opcional si se usa periodo)',
  })
  @IsOptional()
  @IsDateString()
  fecha_inicio?: Date;

  @ApiPropertyOptional({
    example: '2026-12-31',
    description: 'Fecha final del rango de generación (opcional si se usa periodo)',
  })
  @IsOptional()
  @IsDateString()
  fecha_fin?: Date;

  @ApiPropertyOptional({
    example: 'activa',
    enum: EstadoNomina,
    description: 'Estado de la nómina',
  })
  @IsOptional()
  @IsEnum(EstadoNomina, {
    message: 'Estado inválido',
  })
  estado?: EstadoNomina;

  @ApiPropertyOptional({
    example: 'mayo2026',
    description: 'Periodo de nómina. Ejemplos: mayo2026, 2026-05, mayo2026Q1, 2026-05-Q1',
  })
  @IsOptional()
  @IsString()
  periodo?: string;


}