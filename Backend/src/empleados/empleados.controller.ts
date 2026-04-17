import { Body, Controller, Delete, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

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

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Cambiar el estado de un empleado' })
  @ApiParam({ name: 'id', type: Number, description: 'Id del empleado' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        estado: {
          type: 'string',
          example: 'retirado',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Estado actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Estado inválido' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: string,
  ) {
    return this.empleadosService.cambiarEstado(id, estado);
  }
}