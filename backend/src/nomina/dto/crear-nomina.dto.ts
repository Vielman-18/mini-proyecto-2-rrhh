import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearNominaDto {
  @ApiProperty({ example: 'mensual' })
  @IsNotEmpty()
  @IsIn(['mensual', 'quincenal'])
  tipo_periodo!: string;

  @ApiProperty({ example: '2026-04' })
  @IsNotEmpty()
  @IsString()
  periodo!: string;

  @ApiProperty({ example: '2026-04-01' })
  @IsNotEmpty()
  @IsDateString()
  fecha_inicio!: string;

  @ApiProperty({ example: '2026-04-30' })
  @IsNotEmpty()
  @IsDateString()
  fecha_fin!: string;

  @ApiProperty({ example: 'abierta', required: false })
  @IsOptional()
  @IsIn(['abierta', 'cerrada'])
  estado?: string;
}