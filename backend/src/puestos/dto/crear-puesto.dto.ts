import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CrearPuestoDto {

  @ApiProperty({
    example: 1,
    description: 'ID del departamento',
  })
  @IsInt()
  departamento_id!: number;

  @ApiProperty({
    example: 'Analista de Sistemas',
  })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiPropertyOptional({
    example: 'Encargado de análisis y desarrollo',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    example: 'activo',
    default: 'activo',
  })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({
    example: 1,
    description: 'ID del usuario creador',
  })
  @IsInt()
  creado_por!: number;
}