import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

export enum Role {
  ADMIN = 'admin',
  RRHH = 'rrhh',
  EMPLEADO = 'empleado',
}

interface User {
  id: number;
  email: string;
  password: string;
  role: Role;
}

@Injectable()
export class AuthService {
  private users: User[] = [];
  private idCounter = 1;

  constructor(private jwtService: JwtService) {}

  async register(email: string, password: string, role: Role = Role.EMPLEADO) {
    const exists = this.users.find(u => u.email === email);
    if (exists) throw new ConflictException('El usuario ya existe');
    const hashed = await bcrypt.hash(password, 10);
    const user: User = { id: this.idCounter++, email, password: hashed, role };
    this.users.push(user);
    return { message: 'Usuario registrado correctamente', userId: user.id };
  }

  async login(email: string, password: string) {
    const user = this.users.find(u => u.email === email);
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales incorrectas');
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload), role: user.role };
  }

  findById(id: number) {
    return this.users.find(u => u.id === id);
  }
}