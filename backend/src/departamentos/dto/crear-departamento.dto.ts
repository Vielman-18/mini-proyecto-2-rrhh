import { IsInt, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearDepartamentoDto {

  @ApiProperty({
    example: 'Recursos Humanos',
    description: 'Nombre del departamento',
  })
  @IsString()
  nombre!: string;

  @ApiPropertyOptional({
    example: 'Encargado de contratación y personal',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID del usuario que crea el departamento',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  creado_por?: number;

  @ApiPropertyOptional({
    example: 'activo',
    default: 'activo',
  })
  @IsOptional()
  @IsString()
  estado?: string;
}