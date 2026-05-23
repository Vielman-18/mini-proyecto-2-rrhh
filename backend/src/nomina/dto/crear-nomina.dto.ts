import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

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
  

  @ApiProperty({
    example: '2026-01-01',
    description: 'Fecha de inicio del rango de generación',
  })
  @IsDateString()
  fecha_inicio!: Date;

  @ApiProperty({
    example: '2026-12-31',
    description: 'Fecha final del rango de generación',
  })
  @IsDateString()
  fecha_fin!: Date;

  @ApiPropertyOptional({
    example: 'abierta',
    description: 'Estado de la nómina',
  })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiPropertyOptional({
    example: '2026-01',
    description: 'Periodo manual (solo si no es generación automática)',
  })
  @IsOptional()
  @IsString()
  periodo?: string;


}