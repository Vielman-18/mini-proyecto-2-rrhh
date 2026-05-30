import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'usuario@correo.com' })
  @IsEmail()
  correo!: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  nombre!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  contrasena!: string;

  @ApiProperty({ example: 'admin' })
  @IsString()
  rol!: string;
}