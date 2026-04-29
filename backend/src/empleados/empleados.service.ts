import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmpleadosService {
  constructor(private prisma: PrismaService) {}

  async crear(data: any) {
    const existe = await this.prisma.empleados.findUnique({
      where: { dpi: data.dpi }
    });
    if (existe) throw new ConflictException('Ya existe un empleado con ese DPI');

    return this.prisma.empleados.create({
      data: {
        nombres: data.nombres,
        apellidos: data.apellidos,
        dpi: data.dpi,
        fecha_nacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : null,
        direccion: data.direccion,
        telefono: data.telefono,
        salario: data.salario,
        cargo: data.cargo,
        departamento: data.departamento,
        estado: 'activo',
      }
    });
  }

  async listar() {
    return this.prisma.empleados.findMany({
      orderBy: { id: 'asc' }
    });
  }

  async buscarPorId(id: number) {
    const empleado = await this.prisma.empleados.findUnique({
      where: { id }
    });
    if (!empleado) throw new NotFoundException('Empleado no encontrado');
    return empleado;
  }

  async actualizar(id: number, data: any) {
    return this.prisma.empleados.update({
      where: { id },
      data: {
        nombres: data.nombres,
        apellidos: data.apellidos,
        direccion: data.direccion,
        telefono: data.telefono,
        salario: data.salario,
        cargo: data.cargo,
        departamento: data.departamento,
      }
    });
  }

  async eliminar(id: number) {
    await this.prisma.empleados.delete({ where: { id } });
    return { message: 'Empleado eliminado correctamente' };
  }

  async cambiarEstado(id: number, estado: string) {
    return this.prisma.empleados.update({
      where: { id },
      data: { estado }
    });
  }
}