import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';

export enum EstadoLaboral {
  ACTIVO = 'activo',
  SUSPENDIDO = 'suspendido',
  RETIRADO = 'retirado',
}

export interface Empleado {
  id: number;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  direccion: string;
  telefono: string;
  email: string;
  dpi: string;
  salario: number;
  cargo: string;
  departamento: string;
  estado: EstadoLaboral;
}

@Injectable()
export class EmpleadosService {
  private empleados: Empleado[] = [];
  private idCounter = 1;

  crear(data: Omit<Empleado, 'id' | 'estado'>) {
    const existe = this.empleados.find(e => e.dpi === data.dpi);
    if (existe) throw new ConflictException('Ya existe un empleado con ese DPI');
    const empleado: Empleado = {
      id: this.idCounter++,
      ...data,
      estado: EstadoLaboral.ACTIVO,
    };
    this.empleados.push(empleado);
    return empleado;
  }

  listar() {
    return this.empleados;
  }

  buscarPorId(id: number) {
    const empleado = this.empleados.find(e => e.id === id);
    if (!empleado) throw new NotFoundException('Empleado no encontrado');
    return empleado;
  }

  actualizar(id: number, data: Partial<Omit<Empleado, 'id'>>) {
    const empleado = this.buscarPorId(id);
    Object.assign(empleado, data);
    return empleado;
  }

  eliminar(id: number) {
    const index = this.empleados.findIndex(e => e.id === id);
    if (index === -1) throw new NotFoundException('Empleado no encontrado');
    this.empleados.splice(index, 1);
    return { message: 'Empleado eliminado correctamente' };
  }

  cambiarEstado(id: number, estado: EstadoLaboral) {
    const empleado = this.buscarPorId(id);
    empleado.estado = estado;
    return empleado;
  }
}