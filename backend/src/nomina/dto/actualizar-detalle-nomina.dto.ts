import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class ActualizarDetalleNominaDto {
  @ApiPropertyOptional({ example: 160 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  horas_trabajadas?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  horas_extra?: number;

  @ApiPropertyOptional({ example: 250 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bonificaciones?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  comisiones?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  deducciones?: number;

  @ApiPropertyOptional({ example: 75 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  descuentos_legales?: number;
}
