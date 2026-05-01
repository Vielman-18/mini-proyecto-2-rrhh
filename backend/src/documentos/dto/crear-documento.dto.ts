import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearDocumentoDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumberString()
  empleado_id!: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumberString()
  usuario_id!: string;

  @ApiProperty({ example: 'DPI' })
  @IsNotEmpty()
  @IsString()
  tipo_documento!: string;
}