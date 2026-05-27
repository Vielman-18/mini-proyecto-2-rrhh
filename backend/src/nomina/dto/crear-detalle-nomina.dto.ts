
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearDetalleNominaDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  nomina_id!: number;

  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  empleado_id!: number;

  @ApiProperty({ example: 3500 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salario_base!: number;

 

  @ApiProperty({ example: 160 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  horas_trabajadas?: number;

  @ApiProperty({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  horas_extra?: number;

  @ApiProperty({ example: 250 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bonificaciones?: number;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  comisiones?: number;

  @ApiProperty({ example: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  deducciones?: number;

  @ApiProperty({ example: 75 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  descuentos_legales?: number;
}