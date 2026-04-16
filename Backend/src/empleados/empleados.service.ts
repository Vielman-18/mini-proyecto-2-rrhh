import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmpleadosService {
  constructor(private readonly prisma: PrismaService) {}

  async remove(id: number) {
    const empleado = await this.prisma.empleados.findUnique({
      where: { id },
    });

    if (!empleado) {
      throw new NotFoundException(`Empleado con id ${id} no existe`);
    }

    await this.prisma.empleados.delete({
      where: { id },
    });

    return {
      message: 'Empleado eliminado correctamente',
    };
  }

  async cambiarEstado(id: number, estado: string) {
    const estadosValidos = ['activo', 'suspendido', 'retirado'];

    if (!estadosValidos.includes(estado)) {
      throw new BadRequestException(
        'Estado inválido. Solo se permite: activo, suspendido o retirado',
      );
    }

    const empleado = await this.prisma.empleados.findUnique({
      where: { id },
    });

    if (!empleado) {
      throw new NotFoundException(`Empleado con id ${id} no existe`);
    }

    const empleadoActualizado = await this.prisma.empleados.update({
      where: { id },
      data: { estado },
    });

    return {
      message: 'Estado del empleado actualizado correctamente',
      data: empleadoActualizado,
    };
  }
}