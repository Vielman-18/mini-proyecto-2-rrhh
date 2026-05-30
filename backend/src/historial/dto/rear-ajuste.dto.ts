import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CrearAjusteDto {

  @IsInt()
  detalle_nomina_id!: number;

  @IsInt()
  usuario_id!: number;

  @IsString()
  campo_modificado!: string;

  @IsOptional()
  @IsNumber()
  valor_anterior?: number;

  @IsOptional()
  @IsNumber()
  valor_nuevo?: number;

  @IsOptional()
  @IsString()
  motivo?: string;
}