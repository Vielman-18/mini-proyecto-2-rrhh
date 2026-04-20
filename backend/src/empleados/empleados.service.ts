import { Injectable, NotFoundException } from '@nestjs/common';
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
}