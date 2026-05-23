import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import { PuestosService } from './puestos.service';
import { CrearPuestoDto } from './dto/crear-puesto.dto';


@Controller('puestos')
export class PuestosController {

  constructor(
    private readonly puestosService: PuestosService,
  ) {}

  @Post()
  crear(
    @Body() dto: CrearPuestoDto,
  ) {
    return this.puestosService.crear(dto);
  }

 
  @Get()
  listar() {
    return this.puestosService.listar();
  }

  
  @Get(':id')
  obtenerPorId(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.puestosService.obtenerPorId(id);
  }



  @Delete(':id')
  eliminar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.puestosService.eliminar(id);
  }
}