import {
  Body,
  Controller,
  Param,
  Delete,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  @Delete('retirar-acceso/:id')
retirarAcceso(@Param('id') id: string) {
  return this.authService.retirarAcceso(Number(id));
}

  @Post('vincular-usuario/:id')
  vincularUsuario(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { usuarioId: number; correo: string },
  ) {
    return this.authService.vincularUsuario(id, body);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}