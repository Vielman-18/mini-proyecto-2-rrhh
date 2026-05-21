
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearDetalleNominaDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  nomina_id!: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  empleado_id!: number;

  @ApiProperty({ example: 3500 })
  @IsNumber()
  @Min(0)
  salario_base!: number;

 

  @ApiProperty({ example: 160 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  horas_trabajadas?: number;

  @ApiProperty({ example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  horas_extra?: number;

  @ApiProperty({ example: 250 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bonificaciones?: number;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  comisiones?: number;

  @ApiProperty({ example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  deducciones?: number;

  @ApiProperty({ example: 75 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  descuentos_legales?: number;
}