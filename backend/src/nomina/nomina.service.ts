import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { nomina } from '@prisma/client';

@Injectable()
export class NominaService {
  constructor(private prisma: PrismaService) {}

  async crearNomina(periodo: string): Promise<nomina> {
    return this.prisma.nomina.create({
      data: {
        tipo_periodo: "mensual", // usa el nombre exacto del schema
        periodo,
        fecha_inicio: new Date(),
        fecha_fin: new Date(),
        estado: "abierta",
      },
    });
  }

  async listarNominas(): Promise<nomina[]> {
    return this.prisma.nomina.findMany();
  }
}
