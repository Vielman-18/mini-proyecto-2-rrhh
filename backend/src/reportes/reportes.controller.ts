import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ReportesService } from './reportes.service';

class ReporteNominaDto {
  empleadoId: number;
  nombres: string;
  apellidos: string;
  salarioBase: number;
  horasExtra: number;
  bonificaciones: number;
  deducciones: number;
  totalPagar: number;
  periodo: string;
}

class ReporteExpedienteDto {
  empleadoId: number;
  nombres: string;
  apellidos: string;
  estado: string;
  documentosFaltantes: string[];
}

@Controller('reportes')
export class ReportesController {
  constructor(private reportesService: ReportesService) {}

  @Post('nomina')
  agregarReporteNomina(@Body() dto: ReporteNominaDto) {
    return this.reportesService.agregarReporteNomina(dto);
  }

  @Get('nomina')
  obtenerReportesNomina(@Query('periodo') periodo?: string) {
    return this.reportesService.obtenerReportesNomina(periodo);
  }

  @Get('nomina/resumen')
  generarResumenNomina(@Query('periodo') periodo: string) {
    return this.reportesService.generarResumenNomina(periodo);
  }

  @Post('expedientes')
  agregarReporteExpediente(@Body() dto: ReporteExpedienteDto) {
    return this.reportesService.agregarReporteExpediente(dto);
  }

  @Get('expedientes')
  obtenerReporteExpedientes() {
    return this.reportesService.obtenerReporteExpedientes();
  }
}