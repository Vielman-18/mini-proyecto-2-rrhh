import { Controller, Post, Body, Get } from '@nestjs/common';
import { NominaService } from './nomina.service';
import { nomina } from '@prisma/client';

@Controller('nomina')
export class NominaController {
  constructor(private readonly nominaService: NominaService) {}

  // Crear una nueva nómina para un periodo
  @Post('crear')
  async crear(@Body('periodo') periodo: string): Promise<nomina> {
    return this.nominaService.crearNomina(periodo);
  }

  // Listar todas las nóminas registradas
  @Get('listar')
  async listar(): Promise<nomina[]> {
    return this.nominaService.listarNominas();
  }
}