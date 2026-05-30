import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Response } from 'express';

@Injectable()
export class NominaPdfService {

  private formatDate(date: string | Date) {
    const d = new Date(date);
    return d.toLocaleDateString('es-GT', { timeZone: 'UTC' });
  }

  async generarTodasNominas(nominas: any[], res: Response) {
    const doc = new PDFDocument({
      margin: 30,
      size: 'A4',
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=nominas_todas.pdf`,
    );

    doc.pipe(res);

    let y = 40;

    const escribirEncabezadoNomina = (nomina: any) => {
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .text(`NÓMINA: ${nomina.periodo ?? 'SIN PERIODO'}`, 40, y);

      doc.fontSize(10)
        .font('Helvetica')
        .text(
          `Del ${this.formatDate(nomina.fecha_inicio)} al ${this.formatDate(nomina.fecha_fin)}`,
          40,
          y + 18,
        );

      doc.text(`Estado: ${nomina.estado ?? 'N/A'}`, 40, y + 32);

      y += 60;

      doc.moveTo(40, y).lineTo(560, y).stroke();
      y += 15;
    };

    const escribirEmpleado = (detalle: any) => {
      const empleado = detalle.empleados || {};

      const salarioBase = Number(detalle.salario_base ?? 0);
      const bonificaciones = Number(detalle.bonificaciones ?? 0);
      const comisiones = Number(detalle.comisiones ?? 0);
      const horasExtra = Number(detalle.monto_horas_extra ?? 0);

      const ingresos = salarioBase + bonificaciones + comisiones + horasExtra;

      const igss = Number(detalle.igss ?? salarioBase * 0.0483);
      const irtra = Number(detalle.irtra ?? 0);

      const descuentos =
        igss +
        irtra +
        Number(detalle.descuentos_legales ?? 0);

      const total = ingresos - descuentos;

      doc.fontSize(10).font('Helvetica-Bold')
        .text(
          `${empleado.nombres ?? ''} ${empleado.apellidos ?? ''}`,
          45,
          y,
        );

      doc.fontSize(9).font('Helvetica')
        .text(`Puesto: ${empleado.puestos?.nombre ?? 'N/A'}`, 45, y + 12)
        .text(`Base: Q${salarioBase.toFixed(2)}`, 250, y + 12)
        .text(`Ingresos: Q${ingresos.toFixed(2)}`, 360, y + 12)
        .text(`Descuentos: Q${descuentos.toFixed(2)}`, 450, y + 12);

      doc.font('Helvetica-Bold')
        .text(`Líquido: Q${total.toFixed(2)}`, 45, y + 28);

      y += 55;

      if (y > 720) {
        doc.addPage();
        y = 40;
      }
    };

    for (const nomina of nominas) {
      escribirEncabezadoNomina(nomina);

      const detalles = nomina.detalle_nomina || [];

      for (const detalle of detalles) {
        escribirEmpleado(detalle);
      }

      y += 20;

      doc.moveTo(40, y).lineTo(560, y).stroke();
      y += 30;

      if (y > 700) {
        doc.addPage();
        y = 40;
      }
    }

    doc.end();
  }
}