import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReportesService } from './reportes.service';
import { FiltroReporteNominaDto } from './dto/filtro-reporte-nomina.dto';

@ApiTags('Reportes')
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('nomina')
  @ApiQuery({ name: 'periodo', required: false, example: '2026-04' })
  obtenerReportesNomina(@Query() query: FiltroReporteNominaDto) {
    return this.reportesService.obtenerReportesNomina(query.periodo);
  }

  @Get('nomina/resumen')
  @ApiQuery({ name: 'periodo', required: true, example: '2026-04' })
  generarResumenNomina(@Query('periodo') periodo: string) {
    return this.reportesService.generarResumenNomina(periodo);
  }

  @Get('expedientes')
  obtenerReporteExpedientes() {
    return this.reportesService.obtenerReporteExpedientes();
  }

  @Get('academico')
  obtenerReporteAcademico() {
    return this.reportesService.obtenerReporteAcademico();
  }

  @Get('contratacion')
  obtenerReporteContratacion() {
    return this.reportesService.obtenerReporteContratacion();
  }
}