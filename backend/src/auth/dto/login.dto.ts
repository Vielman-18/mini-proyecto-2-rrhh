import { IsEmail, IsNotEmpty, IsString, IsIn } from 'class-validator';

export class LoginDto {
  @IsEmail()
  correo!: string;

  @IsString()
  @IsNotEmpty()
  contrasena!: string;

  @IsString()
  @IsIn(['admin', 'empleado', 'rrhh'])
  rol!  : string;
}