import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { PuestosService } from './puestos.service';
import { CrearPuestoDto } from './dto/crear-puesto.dto';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Puestos')
@Controller('puestos')
export class PuestosController {

  constructor(
    private readonly puestosService: PuestosService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear puesto' })
  @ApiBody({ type: CrearPuestoDto })
  @ApiResponse({ status: 201, description: 'Puesto creado correctamente' })
  @ApiResponse({ status: 400, description: 'Error de validación' })
  crear(@Body() dto: CrearPuestoDto) {
    return this.puestosService.crear(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar puestos' })
  listar() {
    return this.puestosService.listar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener puesto por ID' })
  @ApiParam({ name: 'id', example: 1 })
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.puestosService.obtenerPorId(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar puesto' })
  @ApiParam({ name: 'id', example: 1 })
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.puestosService.eliminar(id);
  }
}