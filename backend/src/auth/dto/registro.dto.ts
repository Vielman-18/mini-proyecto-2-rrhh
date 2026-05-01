import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';


export class RegisterDto {
  @IsEmail()
  correo!: string;

  @IsString()
  nombre!: string;

  @IsString()
  @MinLength(6)
  contrasena!: string;

 @IsString()
  rol!: string; // admin | rrhh | empleado
}
