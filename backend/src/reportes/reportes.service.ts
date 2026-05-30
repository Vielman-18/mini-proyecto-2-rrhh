import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
import { NominaPdfService } from './nomina-pdf/general-pdf.service';


@Injectable()
export class ReportesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nominaPdfService: NominaPdfService,
  ) {}

  async obtenerReportesNomina(periodo?: string) {
    const detalles = await this.prisma.detalle_nomina.findMany({
      where: periodo
        ? {
            nomina: {
              periodo,
            },
          }
        : {},
      include: {
        empleados: true,
        nomina: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return detalles.map((detalle) => ({
      detalleId: detalle.id,
      empleadoId: detalle.empleado_id,
      nombres: detalle.empleados.nombres,
      apellidos: detalle.empleados.apellidos,
      salarioBase: Number(detalle.salario_base),
      horasExtra: Number(detalle.horas_extra || 0),
      bonificaciones: Number(detalle.bonificaciones || 0),
      deducciones: Number(detalle.deducciones || 0),
      totalPagar: Number(detalle.salario_final),
      periodo: detalle.nomina.periodo,
      tipoPeriodo: detalle.nomina.tipo_periodo,
      estadoNomina: detalle.nomina.estado,
    }));
  }

  async generarResumenNomina(periodo: string) {
    const reportes = await this.obtenerReportesNomina(periodo);

    const totalGeneral = reportes.reduce((acc, item) => acc + item.totalPagar, 0);
    const totalDeducciones = reportes.reduce((acc, item) => acc + item.deducciones, 0);
    const totalBonificaciones = reportes.reduce((acc, item) => acc + item.bonificaciones, 0);

    return {
      periodo,
      totalEmpleados: reportes.length,
      totalGeneral,
      totalDeducciones,
      totalBonificaciones,
      detalle: reportes,
    };
  }

  async obtenerReporteExpedientes() {
    const empleados = await this.prisma.empleados.findMany({
      include: {
        documentos: true,
        estado_expediente: true,
      },
      orderBy: { id: 'asc' },
    });

    const documentosObligatorios = [
      'DPI',
      'CONTRATO',
      'ANTECEDENTES_PENALES',
      'ANTECEDENTES_POLICIALES',
      'CERTIFICADO_ESTUDIO',
    ];

    return empleados.map((empleado) => {
      const documentosSubidos = empleado.documentos.map((doc) =>
        doc.tipo_documento.toUpperCase(),
      );

      const documentosFaltantes = documentosObligatorios.filter(
        (obligatorio) => !documentosSubidos.includes(obligatorio),
      );

      return {
        empleadoId: empleado.id,
        nombres: empleado.nombres,
        apellidos: empleado.apellidos,
        estado:
          documentosFaltantes.length === 0
            ? 'Completo'
            : empleado.estado_expediente?.estado || 'Incompleto',
        totalDocumentos: empleado.documentos.length,
        documentosFaltantes,
      };
    });
  }

  async obtenerReporteAcademico() {
    const empleados = await this.prisma.empleados.findMany({
      include: {
        registro_academico: true,
      },
      orderBy: { id: 'asc' },
    });

    return empleados.map((empleado) => ({
      empleadoId: empleado.id,
      nombres: empleado.nombres,
      apellidos: empleado.apellidos,
      totalRegistrosAcademicos: empleado.registro_academico.length,
      registros: empleado.registro_academico.map((registro) => ({
        titulo: registro.titulo,
        institucion: registro.institucion,
        fechaGraduacion: registro.fecha_graduacion,
      })),
    }));
  }

  async generarTodasNominas(res: Response) {
    const nominas = await this.prisma.nomina.findMany({
      include: {
        detalle_nomina: {
          include: { empleados: { include: { puestos: true } } },
        },
      },
      orderBy: { fecha_creacion: 'desc' },
    });

    return this.nominaPdfService.generarTodasNominas(nominas, res);
  }

  async obtenerReporteContratacion() {
    const empleados = await this.prisma.empleados.findMany({
      include: {
        documentos: true,
        registro_academico: true,
      },
      orderBy: { id: 'asc' },
    });

    return empleados.map((empleado) => {
      const tieneDpi = empleado.documentos.some(
        (doc) => doc.tipo_documento.toUpperCase() === 'DPI',
      );

      const tieneContrato = empleado.documentos.some(
        (doc) => doc.tipo_documento.toUpperCase() === 'CONTRATO',
      );

      const cumple =
        !!empleado.dpi &&
        !!empleado.nombres &&
        !!empleado.apellidos &&
        tieneDpi &&
        tieneContrato;

      return {
        empleadoId: empleado.id,
        nombres: empleado.nombres,
        apellidos: empleado.apellidos,
        dpi: empleado.dpi,
        estadoLaboral: empleado.estado,
        tieneDpi,
        tieneContrato,
        tieneRegistrosAcademicos: empleado.registro_academico.length > 0,
        cumpleContratacion: cumple ? 'Cumple' : 'No cumple',
      };
    });
  }
}