import { Controller, Get, Post, Body } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { empleados } from '@prisma/client'; // usa el nombre exacto del modelo en schema.prisma

@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  // Listar todos los empleados
  @Get()
  async listar(): Promise<empleados[]> {
    return this.empleadosService.listarEmpleados();
  }

  // Crear un nuevo empleado
  @Post()
  async crear(
    @Body('nombres') nombres: string,
    @Body('apellidos') apellidos: string,
    @Body('dpi') dpi: string,
    @Body('salario') salario: number,
  ): Promise<empleados> {
    return this.empleadosService.crearEmpleado(nombres, apellidos, dpi, salario);
  }
}
