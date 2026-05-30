import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Response } from 'express';
import PDFDocument from 'pdfkit';

@Injectable()
export class DocumentosService {
  constructor(private readonly prisma: PrismaService) {}

  async generarPdfDocumentos(res: Response, empleadoId?: number) {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      empleadoId
        ? `attachment; filename=documentos_empleado_${empleadoId}.pdf`
        : `attachment; filename=documentos_todos.pdf`,
    );

    doc.pipe(res);

    const documentos = await this.prisma.documentos.findMany({
      where: empleadoId
        ? { empleado_id: Number(empleadoId) }
        : {},
      include: {
        empleados: true,
      },
      orderBy: {
        fecha_carga: 'desc',
      },
    });

    doc.fontSize(16).text('REPORTE DE DOCUMENTOS', { align: 'center' });
    doc.moveDown();

    if (empleadoId) {
      doc.fontSize(12).text(`Empleado ID: ${empleadoId}`);
      doc.moveDown();
    }

    documentos.forEach((d, index) => {
      const empleado = d.empleados;

      doc
        .fontSize(10)
        .text(`${index + 1}. ${d.tipo_documento}`);

      doc.text(`Empleado: ${empleado.nombres} ${empleado.apellidos}`);
      doc.text(`Archivo: ${d.nombre_archivo}`);
      const fechaCarga = d.fecha_carga
        ? new Date(d.fecha_carga).toLocaleDateString('es-GT')
        : 'N/A';
      doc.text(`Fecha: ${fechaCarga}`);

      doc.moveDown();
      doc.moveTo(30, doc.y).lineTo(560, doc.y).stroke();
      doc.moveDown();
    });

    doc.end();
  }
}