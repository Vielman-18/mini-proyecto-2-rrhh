import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AcademicoService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(body: any) {
    const empleado = await this.prisma.empleados.findUnique({
      where: { id: Number(body.empleado_id) },
    });

    if (!empleado) {
      throw new NotFoundException('El empleado no existe');
    }

    return this.prisma.registro_academico.create({
      data: {
        empleado_id: Number(body.empleado_id),
        titulo: body.titulo,
        institucion: body.institucion,
        fecha_graduacion: body.fecha_graduacion
          ? new Date(body.fecha_graduacion)
          : null,
      },
    });
  }

  async listar() {
    return this.prisma.registro_academico.findMany({
      include: {
        empleados: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async buscarPorEmpleado(id: number) {
    return this.prisma.registro_academico.findMany({
      where: {
        empleado_id: id,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async eliminar(id: number) {
    return this.prisma.registro_academico.delete({
      where: { id },
    });
  }
}