// historial-nomina.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { HistorialNominaService } from './historial.service';

import { CrearAjusteDto } from './dto/rear-ajuste.dto';

@Controller('historial-nomina')
export class HistorialNominaController {

  constructor(
    private readonly historialService:
      HistorialNominaService,
  ) {}

  @Post()
  crear(
    @Body()
    dto: CrearAjusteDto,
  ) {
    return this.historialService.crear(dto);
  }


  @Get('/detalle/:id')
  obtenerPorDetalle(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.historialService.obtenerPorDetalle(
      id,
    );
  }

  @Get('/nomina/:id')
  obtenerPorNomina(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.historialService.obtenerPorNomina(
      id,
    );
  }

  @Delete(':id')
  eliminar(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.historialService.eliminar(id);
  }
}