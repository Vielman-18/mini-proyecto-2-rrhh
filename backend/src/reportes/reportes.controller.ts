import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { ReportesService } from './reportes.service';
import { FiltroReporteNominaDto } from './dto/filtro-reporte-nomina.dto';
import { DocumentosService } from './nomina-pdf/documento-pdf.service';

@ApiTags('Reportes')
@Controller('reportes')
export class ReportesController {
  constructor(
    private readonly reportesService: ReportesService,
    private readonly documentosPdfService: DocumentosService
  ) {}

  @Get('documentos/pdf')
  async generarPdfDocumentos(@Res() res: Response, @Query('empleadoId') empleadoId?: number) {
    return this.documentosPdfService.generarPdfDocumentos(res, empleadoId);
  }

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


@Get('nomina/pdf')
async generarPdfTodasNominas(@Res() res: Response) {
  return this.reportesService.generarTodasNominas(res);
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