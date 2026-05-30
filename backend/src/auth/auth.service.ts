import {
   Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
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

  async retirarAcceso(empleadoId: number) {
    const empleado = await this.prisma.empleados.findUnique({
      where: { id: empleadoId },
    });

    if (!empleado || !empleado.usuario_id) {
      throw new NotFoundException('Este empleado no tiene acceso activo');
    }

    await this.prisma.$transaction([
      this.prisma.empleados.update({
        where: { id: empleadoId },
        data: { usuario_id: null },
      }),
      this.prisma.usuarios.delete({
        where: { id: empleado.usuario_id },
      }),
    ]);

    return { message: 'Acceso retirado correctamente' };
  }

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

  async vincularUsuario(id: number, body: { usuarioId: number; correo: string }) {
    return this.prisma.empleados.update({
      where: { id },
      data: {
        usuario_id: Number(body.usuarioId),
        email: body.correo,
      },
    });
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

    const payload = {
      sub: user.id,
      correo: user.correo,
      rol: user.rol,
    };

    return {
      token: this.jwtService.sign(payload),
      rol: user.rol,
      userId: user.id,
    };
  }
}