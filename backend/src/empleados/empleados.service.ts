import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearEmpleadoDto } from './dto/crear-empleado.dto';
import { ActualizarEmpleadoDto } from './dto/actualizar-empleado.dto';

export enum EstadoLaboral {
  ACTIVO = 'activo',
  SUSPENDIDO = 'suspendido',
  RETIRADO = 'retirado',
}

@Injectable()
export class EmpleadosService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: CrearEmpleadoDto) {
    return this.prisma.empleados.create({
      data: {
        nombres: dto.nombres,
        apellidos: dto.apellidos,
        dpi: dto.dpi,
        fecha_nacimiento: dto.fechaNacimiento
          ? new Date(dto.fechaNacimiento)
          : null,
        direccion: dto.direccion,
        telefono: dto.telefono,
       email: dto.email, 
       
       salario: Number(dto.salario),
       puesto_id: dto.puesto_id,
        departamento_id: dto.departamento_id,
        estado: EstadoLaboral.ACTIVO,
      },
    });
  }

async listar() {
  return this.prisma.empleados.findMany({
    include: {
      departamentos: true,
      puestos: true,
    },

    orderBy: {
      id: 'asc',
    },
  });
}

  async buscarPorId(id: number) {
  const empleado = await this.prisma.empleados.findUnique({
    where: { id },

    include: {
      departamentos: true,
      puestos: true,
    },
  });

  if (!empleado) {
    throw new NotFoundException('Empleado no encontrado');
  }

  return empleado;
}

  async actualizar(id: number, dto: ActualizarEmpleadoDto) {
    await this.buscarPorId(id);

    return this.prisma.empleados.update({
      where: { id },
      data: {
        nombres: dto.nombres,
        apellidos: dto.apellidos,
        dpi: dto.dpi,
        fecha_nacimiento: dto.fechaNacimiento
          ? new Date(dto.fechaNacimiento)
          : undefined,
        direccion: dto.direccion,
        email: dto.email,
        telefono: dto.telefono,
        salario: dto.salario !== undefined ? Number(dto.salario) : undefined,
        puesto_id: dto.puesto_id,
        departamento_id: dto.departamento_id,
      },
    });
  }

  async eliminar(id: number) {
    await this.buscarPorId(id);

    return this.prisma.empleados.delete({
      where: { id },
    });
  }

  async cambiarEstado(id: number, estado: EstadoLaboral) {
    await this.buscarPorId(id);

    return this.prisma.empleados.update({
      where: { id },
      data: {
        estado,
      },
    });
  }
}
