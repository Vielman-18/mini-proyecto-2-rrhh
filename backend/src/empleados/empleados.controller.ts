import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';

class CrearEmpleadoDto {
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
}

class CambiarEstadoDto {
  estado: string;
}

@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @Post()
  crear(@Body() data: CrearEmpleadoDto) {
    return this.empleadosService.crear(data);
  }

  @Get()
  listar() {
    return this.empleadosService.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.empleadosService.buscarPorId(id);
  }

  @Put(':id')
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<CrearEmpleadoDto>) {
    return this.empleadosService.actualizar(id, data);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.empleadosService.eliminar(id);
  }

  @Put(':id/estado')
  cambiarEstado(@Param('id', ParseIntPipe) id: number, @Body() dto: CambiarEstadoDto) {
    return this.empleadosService.cambiarEstado(id, dto.estado);
  }
}