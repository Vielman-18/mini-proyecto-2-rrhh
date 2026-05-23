import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Response } from 'express';

@Injectable()
export class NominaPdfService {

  private formatDate(date: string | Date) {
    const d = new Date(date);
    return d.toLocaleDateString('es-GT', { timeZone: 'UTC' });
  }

  async generarBoletaEmpleado(detalle: any, res: Response) {
    const doc = new PDFDocument({
      margin: 30,
      size: 'A4',
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=boleta_${detalle.empleados.id}.pdf`,
    );

    doc.pipe(res);

    const empleado = detalle.empleados;
    const nomina = detalle.nomina;

    const salarioBase = Number(detalle.salario_base || 0);
    const bonificaciones = Number(detalle.bonificaciones || 0);
    const comisiones = Number(detalle.comisiones || 0);
    const horasExtra = Number(detalle.monto_horas_extra || 0);

    const ingresos =
      salarioBase +
      bonificaciones +
      comisiones +
      horasExtra;

    const descuentos =
      Number(detalle.igss || 0) +
      Number(detalle.irtra || 0) +
      Number(detalle.descuentos_legales || 0);

    const salarioFinal = Number(detalle.salario_final || 0);

    const crearBoleta = (yStart: number) => {

      doc.fontSize(15)
        .font('Helvetica-Bold')
        .text('RECIBO DE PAGO MENSUAL', 180, yStart);

      doc.fontSize(10)
        .font('Helvetica')
        .text(
          `Periodo: ${this.formatDate(nomina.fecha_inicio)} al ${this.formatDate(nomina.fecha_fin)}`,
          320,
          yStart + 20,
        );

      doc.roundedRect(40, yStart + 50, 520, 90, 10).stroke();

      doc.fontSize(9);

      doc.text(`ID: ${empleado.id}`, 55, yStart + 65);

      doc.text(`DPI: ${empleado.dpi || 'N/A'}`, 55, yStart + 82);

      doc.text(
        `Nombre: ${empleado.nombres} ${empleado.apellidos}`,
        55,
        yStart + 99,
      );

      doc.text(
        `Puesto: ${empleado.cargo || 'Empleado'}`,
        55,
        yStart + 116,
      );

      doc.moveTo(40, yStart + 155)
        .lineTo(560, yStart + 155)
        .stroke();

      doc.font('Helvetica-Bold').text('INGRESOS', 130, yStart + 165);
      doc.text('DESCUENTOS', 360, yStart + 165);

      doc.font('Helvetica');

      doc.text('SALARIO BASE', 60, yStart + 190);
      doc.text(`Q${salarioBase.toFixed(2)}`, 220, yStart + 190);

      doc.text('IGSS', 330, yStart + 190);
      doc.text(`Q${Number(detalle.igss || 0).toFixed(2)}`, 470, yStart + 190);

      doc.text('BONIFICACIONES', 60, yStart + 210);
      doc.text(`Q${bonificaciones.toFixed(2)}`, 220, yStart + 210);

      doc.text('IRTRA', 330, yStart + 210);
      doc.text(`Q${Number(detalle.irtra || 0).toFixed(2)}`, 470, yStart + 210);

      doc.text('HORAS EXTRA', 60, yStart + 230);
      doc.text(`Q${horasExtra.toFixed(2)}`, 220, yStart + 230);

      doc.text('DESC. LEGALES', 330, yStart + 230);
      doc.text(`Q${Number(detalle.descuentos_legales || 0).toFixed(2)}`, 470, yStart + 230);

      doc.moveTo(40, yStart + 265)
        .lineTo(560, yStart + 265)
        .stroke();

      doc.font('Helvetica-Bold')
        .text(`TOTAL INGRESOS: Q${ingresos.toFixed(2)}`, 50, yStart + 280);

      doc.text(`TOTAL DESCUENTOS: Q${descuentos.toFixed(2)}`, 320, yStart + 280);

      doc.fontSize(14)
        .text(`LÍQUIDO: Q${salarioFinal.toFixed(2)}`, 50, yStart + 320);

      doc.moveTo(180, yStart + 390)
        .lineTo(380, yStart + 390)
        .stroke();

      doc.fontSize(9)
        .text(`${empleado.nombres} ${empleado.apellidos}`, 220, yStart + 395);
    };

    crearBoleta(40);
    doc.dash(1, { space: 4 })
      .moveTo(40, 430)
      .lineTo(560, 430)
      .stroke();
    doc.undash();
    crearBoleta(460);

    doc.end();
  }

  async generar(nomina: any, detalles: any[], totalPlanilla: number, res: Response) {
    const doc = new PDFDocument({
      margin: 40,
      size: 'A4',
      bufferPages: true,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=nomina_${nomina.periodo}.pdf`,
    );

    doc.pipe(res);

    const primary = '#0F172A';
    const secondary = '#1D4ED8';
    const success = '#15803D';
    const gray = '#64748B';
    const light = '#F8FAFC';
    const border = '#CBD5E1';

    doc.rect(0, 0, doc.page.width, 110).fill(primary);

    doc.fillColor('white')
      .fontSize(26)
      .font('Helvetica-Bold')
      .text('REPORTE GENERAL DE NÓMINA', 40, 30);

    doc.fontSize(12)
      .font('Helvetica')
      .fillColor('#E2E8F0')
      .text('Sistema de Gestión de Recursos Humanos', 40, 65);

    doc.fontSize(10)
      .text(`Generado: ${new Date().toLocaleString()}`, 40, 82);

    const infoY = 140;

    doc.roundedRect(40, infoY, 520, 110, 8).fill(light);
    doc.strokeColor(border).roundedRect(40, infoY, 520, 110, 8).stroke();

    doc.fillColor(primary)
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('INFORMACIÓN DE LA NÓMINA', 55, infoY + 15);

    doc.font('Helvetica')
      .fontSize(11)
      .fillColor('black');

    doc.text(`ID Nómina: ${nomina.id}`, 55, infoY + 45);

    doc.text(`Periodo: ${nomina.periodo}`, 220, infoY + 45);

    doc.text(`Estado: ${nomina.estado}`, 420, infoY + 45);

    doc.text(
      `Fecha Inicio: ${this.formatDate(nomina.fecha_inicio)}`,
      55,
      infoY + 70,
    );

    doc.text(
      `Fecha Fin: ${this.formatDate(nomina.fecha_fin)}`,
      300,
      infoY + 70,
    );

    let tableTop = infoY + 140;

    doc.rect(40, tableTop, 520, 28).fill(secondary);

    doc.fillColor('white')
      .fontSize(9)
      .font('Helvetica-Bold');

    doc.text('EMPLEADO', 45, tableTop + 9);
    doc.text('DPI', 120, tableTop + 9);
    doc.text('CARGO', 200, tableTop + 9);
    doc.text('BASE', 280, tableTop + 9);
    doc.text('BONOS', 340, tableTop + 9);
    doc.text('IGSS', 400, tableTop + 9);
    doc.text('TOTAL', 480, tableTop + 9);

    let y = tableTop + 35;

    detalles.forEach((d, index) => {

      const empleado = d.empleados;

      const salarioBase = Number(d.salario_base || 0);
      const bonificaciones = Number(d.bonificaciones || 0);
      const igss = Number(d.igss || 0);
      const salarioFinal = Number(d.salario_final || 0);

      const bg = index % 2 === 0 ? '#FFFFFF' : '#F8FAFC';

      doc.rect(40, y, 520, 40).fill(bg);

      doc.fillColor('black').fontSize(8);

      doc.text(`${empleado.nombres} ${empleado.apellidos}`, 45, y + 10);

      doc.text(empleado.dpi || 'N/A', 120, y + 10);

      doc.text(empleado.cargo || 'N/A', 200, y + 10);

      doc.text(`Q${salarioBase.toFixed(2)}`, 280, y + 10);

      doc.text(`Q${bonificaciones.toFixed(2)}`, 340, y + 10);

      doc.fillColor('red')
        .text(`Q${igss.toFixed(2)}`, 400, y + 10);

      doc.fillColor('green')
        .text(`Q${salarioFinal.toFixed(2)}`, 480, y + 10);

      y += 45;

      if (y > 700) {
        doc.addPage();
        y = 60;
      }
    });

    doc.end();
  }
}