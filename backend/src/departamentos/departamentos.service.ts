import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CrearDepartamentoDto} from './dto/crear-departamento.dto';

@Injectable()
export class DepartamentosService {
  constructor(private readonly prisma: PrismaService) {}    

  async crear(dto: CrearDepartamentoDto) {
    return this.prisma.departamentos.create({
      data: {
        nombre: dto.nombre,
        creado_por: dto.creado_por || 1,
        descripcion: dto.descripcion || '',
        estado: dto.estado || 'activo',
      },
    });
  }

  async Listar() {
    return this.prisma.departamentos.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async buscarPorId(id: number) {
    const departamento = await this.prisma.departamentos.findUnique({
      where: {id},
    });
    if (!departamento) {
      throw new NotFoundException('Departamento no encontrado');
    }
    return departamento;
  }

  async eliminar(id: number) {
    await this.buscarPorId(id);
    return this.prisma.departamentos.delete({
      where: {id},
    });
  }

  async cambiarEstado(id: number, estado: string) {
    await this.buscarPorId(id);
    return this.prisma.departamentos.update({
      where: {id},
      data: {estado},
    });
  }
}