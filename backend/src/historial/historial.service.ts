// historial-nomina.service.ts

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CrearAjusteDto } from './dto/rear-ajuste.dto';

@Injectable()
export class HistorialNominaService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async crear(dto: CrearAjusteDto) {

    return this.prisma.ajustes_nomina.create({
      data: {
        detalle_nomina_id:
          dto.detalle_nomina_id,

        usuario_id:
          dto.usuario_id,

        campo_modificado:
          dto.campo_modificado,

        valor_anterior:
          dto.valor_anterior,

        valor_nuevo:
          dto.valor_nuevo,

        motivo:
          dto.motivo,
      },

      include: {
        usuarios: true,
      },
    });
  }

  // =========================
  // HISTORIAL POR DETALLE
  // =========================

  async obtenerPorDetalle(
    detalleId: number,
  ) {

    return this.prisma.ajustes_nomina.findMany({
      where: {
        detalle_nomina_id: detalleId,
      },

      include: {
        usuarios: {
          select: {
            id: true,
            nombre: true,
            correo: true,
          },
        },
        detalle_nomina: {
          include: {
            empleados: true,
          },
        },
      },

      orderBy: {
        fecha_cambio: 'desc',
      },
    });
  }

  // =========================
  // HISTORIAL POR NOMINA
  // =========================

  async obtenerPorNomina(
    nominaId: number,
  ) {

    return this.prisma.ajustes_nomina.findMany({

      where: {
        detalle_nomina: {
          nomina_id: nominaId,
        },
      },

      include: {

        usuarios: {
          select: {
            nombre: true,
            correo: true,
          },
        },

        detalle_nomina: {
          include: {
            empleados: true,
          },
        },
      },

      orderBy: {
        fecha_cambio: 'desc',
      },
    });
  }

  // =========================
  // ELIMINAR AJUSTE
  // =========================

  async eliminar(id: number) {

    const existe =
      await this.prisma.ajustes_nomina.findUnique({
        where: { id },
      });

    if (!existe) {
      throw new NotFoundException(
        'Registro no encontrado',
      );
    }

    return this.prisma.ajustes_nomina.delete({
      where: { id },
    });
  }
}