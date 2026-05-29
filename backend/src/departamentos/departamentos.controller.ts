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
import { DepartamentosService } from './departamentos.service';
import { CrearDepartamentoDto } from './dto/crear-departamento.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Departamentos')
@Controller('departamentos')
export class DepartamentosController {
  constructor(private readonly departamentosService: DepartamentosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear departamento' })
  @ApiBody({ type: CrearDepartamentoDto })
  @ApiResponse({ status: 201, description: 'Departamento creado correctamente' })
  @ApiResponse({ status: 400, description: 'Error de validación' })
  crear(@Body() dto: CrearDepartamentoDto) {
    return this.departamentosService.crear(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar departamentos' })
  listar() {
    return this.departamentosService.Listar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar departamento por ID' })
  @ApiParam({ name: 'id', example: 1 })
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.departamentosService.buscarPorId(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar departamento' })
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.departamentosService.eliminar(id);
  }

  @Put(':id/estado')
  @ApiOperation({ summary: 'Cambiar estado del departamento' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    schema: {
      example: {
        estado: 'inactivo',
      },
    },
  })
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: string,
  ) {
    return this.departamentosService.cambiarEstado(id, estado);
  }
}