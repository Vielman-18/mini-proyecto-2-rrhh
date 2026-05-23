import {
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CrearPuestoDto {

  @IsInt()
  departamento_id!: number;

  @IsString()
  @IsNotEmpty()
  nombre! : string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsInt()
  creado_por!: number;
}