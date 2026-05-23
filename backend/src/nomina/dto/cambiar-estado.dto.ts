import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum EstadoNomina {
  abierta = 'abierta',
  cerrada = 'cerrada',
  inactiva = 'inactiva',
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