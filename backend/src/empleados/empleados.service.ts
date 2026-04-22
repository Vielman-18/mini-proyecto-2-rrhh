import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { empleados } from '@prisma/client';

@Injectable()
export class EmpleadosService {
  constructor(private prisma: PrismaService) {}

  async listarEmpleados(): Promise<empleados[]> {
    return this.prisma.empleados.findMany({
      where: { estado: "activo" },
    });
  }

  async crearEmpleado(nombres: string, apellidos: string, dpi: string, salario: number): Promise<empleados> {
    return this.prisma.empleados.create({
      data: {
        nombres,
        apellidos,
        dpi,
        salario,
        estado: "activo",
      },
    });
  }
}


