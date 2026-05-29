
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

    // =========================
    // CALCULOS FRONTEND
    // =========================

    const salarioBase = Number(detalle.salario_base || 0);

    const bonificaciones = Number(detalle.bonificaciones || 0);

    const comisiones = Number(detalle.comisiones || 0);

    const horasExtra = Number(
      detalle.monto_horas_extra ||
      detalle.valor_horas_extra ||
      0,
    );

    const BONO_INCENTIVO = 250;

    const ingresos =
      salarioBase +
      BONO_INCENTIVO +
      bonificaciones +
      comisiones +
      horasExtra;

    const igss =
      salarioBase * 0.0483;

    const descuentos =
      igss +
      Number(detalle.descuentos_legales || 0);

    const salarioFinal =
      salarioBase +
      BONO_INCENTIVO +
      bonificaciones +
      comisiones +
      horasExtra -
      descuentos;

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
      doc.text(`Q${igss.toFixed(2)}`, 470, yStart + 190);

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

  // ===== ENCABEZADO ESTILO SAT =====
  doc.fontSize(12).font('Helvetica-Bold')
    .text('INFORMACIÓN PÚBLICA DE OFICIO', { align: 'center' });

  doc.fontSize(10).font('Helvetica')
    .text('Reporte de Nómina - Renglón Presupuestario 011', { align: 'center' });

  doc.text(`Periodo: ${nomina.periodo}`, { align: 'center' });

  doc.moveDown(2);

  // ===== TABLA HEADER =====
  const startY = 120;

  doc.fontSize(8).font('Helvetica-Bold');

  doc.rect(40, startY, 520, 20).fill('#1D4ED8');

  doc.fillColor('white');

  doc.text('No.', 45, startY + 5);
  doc.text('NIT', 70, startY + 5);
  doc.text('NOMBRE', 130, startY + 5);
  doc.text('PUESTO', 250, startY + 5);
  doc.text('BASE', 330, startY + 5);
  doc.text('BONOS', 380, startY + 5);
  doc.text('OTROS', 430, startY + 5);
  doc.text('DEVENGADO', 490, startY + 5);

  // ===== FILAS =====
  let y = startY + 25;

  detalles.forEach((d, i) => {
    const emp = d.empleados;

    const base = Number(d.salario_base || 0);

    const bonos =
      Number(d.bonificaciones || 0) + 250;

    const otros =
      Number(d.comisiones || 0) +
      Number(d.monto_horas_extra || 0);

    const igss =
      base * 0.0483;

    const descuentos =
      igss +
      Number(d.descuentos_legales || 0);

    const devengado =
      base +
      bonos +
      otros -
      descuentos;

    const bg = i % 2 === 0 ? '#FFFFFF' : '#F1F5F9';

    doc.rect(40, y - 2, 520, 18).fill(bg);

    doc.fillColor('black').fontSize(7).font('Helvetica');

    doc.text(i + 1, 45, y);
    doc.text(emp.dpi || 'N/A', 70, y);
    doc.text(`${emp.nombres} ${emp.apellidos}`, 130, y);
    doc.text(emp.cargo || 'N/A', 250, y);

    doc.text(`Q${base.toFixed(2)}`, 330, y);
    doc.text(`Q${bonos.toFixed(2)}`, 380, y);
    doc.text(`Q${otros.toFixed(2)}`, 430, y);
    doc.text(`Q${devengado.toFixed(2)}`, 490, y);

    y += 18;

    if (y > 720) {
      doc.addPage();
      y = 60;
    }
  });

  // ===== TOTAL FINAL =====
  doc.moveDown(2);
  doc.fontSize(10).font('Helvetica-Bold')
    .text(`TOTAL PLANILLA: Q${totalPlanilla.toFixed(2)}`, 350, y + 20);

  doc.end();
}
}

