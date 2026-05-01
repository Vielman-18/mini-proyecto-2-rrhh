import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: any) {
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
    };
  }

  async login(correo: string, contrasena: string) {
    const user = await this.prisma.usuarios.findUnique({
      where: { correo },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const valid = await bcrypt.compare(contrasena, user.contrasena);

    if (!valid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = {
      sub: user.id,
      correo: user.correo,
      rol: user.rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
      rol: user.rol,
    };
  }
}