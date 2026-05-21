import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearPuestoDto } from './dto/crear-puesto.dto';

@Injectable()
export class PuestosService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: CrearPuestoDto) {
    return this.prisma.puestos.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion ?? null,
        estado: dto.estado ?? 'activo',
        // Aseguramos que pasamos los IDs como enteros
        departamentos: {
          connect: { id: dto.departamento_id }
        },
        usuarios: {
          connect: { id: dto.creado_por }
        }
      },
    });
  }

  async listar() {
    return this.prisma.puestos.findMany({
      include: {
        departamentos: {
          select: {
            id: true,
            nombre: true,
          },
        },
        usuarios: {
          select: {
            id: true,
            nombre: true,
            correo: true,
          },
        },
        empleados: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async obtenerPorId(id: number) {
    const puesto = await this.prisma.puestos.findUnique({
      where: { id },
      include: {
        departamentos: true,
        usuarios: true,
        empleados: true,
      },
    });

    if (!puesto) {
      throw new NotFoundException('Puesto no encontrado');
    }

    return puesto;
  }

  async eliminar(id: number) {
    const puesto = await this.prisma.puestos.findUnique({
      where: { id },
    });

    if (!puesto) {
      throw new NotFoundException('Puesto no encontrado');
    }

    return this.prisma.puestos.delete({
      where: { id },
    });
  }
}