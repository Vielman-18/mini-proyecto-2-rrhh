import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AcademicoService } from './academico.service';

@ApiTags('Academico')
@Controller('academico')
export class AcademicoController {
  constructor(private readonly academicoService: AcademicoService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        empleado_id: {
          type: 'integer',
          example: 1,
        },
        titulo: {
          type: 'string',
          example: 'Ingeniería en Sistemas',
        },
        institucion: {
          type: 'string',
          example: 'Universidad Mariano Gálvez',
        },
        fecha_graduacion: {
          type: 'string',
          example: '2026-11-30',
        },
      },
      required: ['empleado_id', 'titulo', 'institucion'],
    },
  })
  crear(@Body() body: any) {
    return this.academicoService.crear(body);
  }

  @Get()
  listar() {
    return this.academicoService.listar();
  }

  @Get('empleado/:id')
  buscarPorEmpleado(@Param('id') id: string) {
    return this.academicoService.buscarPorEmpleado(Number(id));
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.academicoService.eliminar(Number(id));
  }
}