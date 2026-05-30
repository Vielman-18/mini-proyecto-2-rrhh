import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum EstadoNomina {
  ACTIVA = 'activa',
  CERRADA = 'cerrada',
  PROCESADA = 'procesada',
}

export class CambiarEstadoDto {
  @ApiProperty({
    example: 'cerrada',
    enum: EstadoNomina,
  })
  @IsEnum(EstadoNomina, {
    message: 'Estado inválido',
  })
  estado!: EstadoNomina;
}