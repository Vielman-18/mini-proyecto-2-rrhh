import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  correo!: string;

  @IsString()
  @IsNotEmpty()
  contrasena!: string;

  @IsOptional()
  @IsString()
  rol?: string;
}