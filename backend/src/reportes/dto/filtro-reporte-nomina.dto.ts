import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FiltroReporteNominaDto {
  @ApiPropertyOptional({ example: '2026-04' })
  @IsOptional()
  @IsString()
  periodo?: string;
}