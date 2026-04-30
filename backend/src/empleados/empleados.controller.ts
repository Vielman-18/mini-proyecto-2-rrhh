import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { CrearEmpleadoDto } from './dto/crear-empleado.dto';
import { ActualizarEmpleadoDto } from './dto/actualizar-empleado.dto';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto';

@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @Post()
  crear(@Body() dto: CrearEmpleadoDto) {
    return this.empleadosService.crear(dto);
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
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarEmpleadoDto,
  ) {
    return this.empleadosService.actualizar(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.empleadosService.eliminar(id);
  }

  @Put(':id/estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CambiarEstadoDto,
  ) {
    return this.empleadosService.cambiarEstado(id, dto.estado);
  }
}
