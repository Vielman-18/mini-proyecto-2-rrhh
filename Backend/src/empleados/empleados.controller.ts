import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Empleados')
@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un empleado por id' })
  @ApiParam({ name: 'id', type: Number, description: 'Id del empleado' })
  @ApiResponse({ status: 200, description: 'Empleado eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.empleadosService.remove(id);
  }
}