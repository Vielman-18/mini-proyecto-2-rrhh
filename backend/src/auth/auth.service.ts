import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.usuarios.findUnique({
      where: { correo: dto.correo },
    });

    if (exists) {
      throw new ConflictException('El usuario ya existe');
    }

    const hashed = await bcrypt.hash(dto.contrasena, 10);

    const user = await this.prisma.usuarios.create({
      data: {
        nombre: dto.nombre,
        correo: dto.correo,
        contrasena: hashed,
        rol: dto.rol,
      },
    });

    return {
      message: 'Usuario registrado correctamente',
      userId: user.id,
      rol: user.rol,
    };
  }
async login(dto: LoginDto) {
  const user = await this.prisma.usuarios.findUnique({
    where: { correo: dto.correo },
  });

  if (!user) {
    throw new UnauthorizedException('Credenciales incorrectas');
  }

  const valid = await bcrypt.compare(dto.contrasena, user.contrasena);

  if (!valid) {
    throw new UnauthorizedException('Credenciales incorrectas');
  }

  if (user.rol.toLowerCase() !== dto.rol.toLowerCase()) {
    throw new UnauthorizedException('El rol no corresponde al usuario');
  }

  const payload = {
    sub: user.id,
    correo: user.correo,
    rol: user.rol,
  };

  return {
    token: this.jwtService.sign(payload),
    rol: user.rol,
  };
}
}