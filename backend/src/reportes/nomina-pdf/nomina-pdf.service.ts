import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Response } from 'express';

@Injectable()
export class NominaPdfService {

  async generarBoletaEmpleado(
  detalle: any,
  res: Response,
) {

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

    doc
      .fontSize(15)
      .font('Helvetica-Bold')
      .text(
        'RECIBO DE PAGO MENSUAL',
        180,
        yStart,
      );

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(
        `Periodo: ${new Date(
          nomina.fecha_inicio,
        ).toLocaleDateString()} al ${new Date(
          nomina.fecha_fin,
        ).toLocaleDateString()}`,
        360,
        yStart + 20,
      );

    doc
      .roundedRect(40, yStart + 50, 520, 70, 10)
      .stroke();

    doc
      .fontSize(9)
      .text(`Código: ${empleado.id}`, 55, yStart + 65);

    doc.text(
      `Nombre: ${empleado.nombres} ${empleado.apellidos}`,
      55,
      yStart + 82,
    );

    doc.text(
      `Puesto: ${empleado.cargo || 'Empleado'}`,
      55,
      yStart + 99,
    );

    doc
      .moveTo(40, yStart + 145)
      .lineTo(560, yStart + 145)
      .stroke();

    doc
      .font('Helvetica-Bold')
      .text('INGRESOS', 130, yStart + 155);

    doc.text('DESCUENTOS', 360, yStart + 155);

    doc
      .font('Helvetica')
      .text(
        'SALARIO BASE',
        60,
        yStart + 180,
      );

    doc.text(
      `Q${salarioBase.toFixed(2)}`,
      220,
      yStart + 180,
    );

    doc.text(
      'IGSS',
      330,
      yStart + 180,
    );

    doc.text(
      `Q${Number(detalle.igss).toFixed(2)}`,
      470,
      yStart + 180,
    );

    doc.text(
      'BONIFICACIONES',
      60,
      yStart + 200,
    );

    doc.text(
      `Q${bonificaciones.toFixed(2)}`,
      220,
      yStart + 200,
    );

    doc.text(
      'IRTRA',
      330,
      yStart + 200,
    );

    doc.text(
      `Q${Number(detalle.irtra).toFixed(2)}`,
      470,
      yStart + 200,
    );

    doc.text(
      'HORAS EXTRA',
      60,
      yStart + 220,
    );

    doc.text(
      `Q${horasExtra.toFixed(2)}`,
      220,
      yStart + 220,
    );

    doc.text(
      'DESC. LEGALES',
      330,
      yStart + 220,
    );

    doc.text(
      `Q${Number(
        detalle.descuentos_legales,
      ).toFixed(2)}`,
      470,
      yStart + 220,
    );

    doc
      .moveTo(40, yStart + 255)
      .lineTo(560, yStart + 255)
      .stroke();

    doc
      .font('Helvetica-Bold')
      .text(
        `TOTAL INGRESOS: Q${ingresos.toFixed(2)}`,
        50,
        yStart + 270,
      );

    doc.text(
      `TOTAL DESCUENTOS: Q${descuentos.toFixed(2)}`,
      320,
      yStart + 270,
    );

    doc
      .fontSize(14)
      .text(
        `LÍQUIDO A RECIBIR: Q${salarioFinal.toFixed(2)}`,
        50,
        yStart + 310,
      );

    doc
      .moveTo(180, yStart + 380)
      .lineTo(380, yStart + 380)
      .stroke();

    doc
      .fontSize(9)
      .text(
        `${empleado.nombres} ${empleado.apellidos}`,
        215,
        yStart + 385,
      );
  };

  crearBoleta(40);

  doc
    .dash(1, { space: 4 })
    .moveTo(40, 420)
    .lineTo(560, 420)
    .stroke();

  doc.undash();

  crearBoleta(450);

  doc.end();
}

  async generar(
    nomina: any,
    detalles: any[],
    totalPlanilla: number,
    res: Response,
  ) {

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

    doc
      .rect(0, 0, doc.page.width, 110)
      .fill(primary);

    doc
      .fillColor('white')
      .fontSize(26)
      .font('Helvetica-Bold')
      .text('REPORTE GENERAL DE NÓMINA', 40, 30);

    doc
      .fontSize(12)
      .font('Helvetica')
      .fillColor('#E2E8F0')
      .text('Sistema de Gestión de Recursos Humanos', 40, 65);

    doc
      .fontSize(10)
      .text(`Generado: ${new Date().toLocaleString()}`, 40, 82);

    doc.moveDown(5);

    const infoY = doc.y;

    doc
      .roundedRect(40, infoY, 520, 100, 8)
      .fill(light);

    doc
      .lineWidth(1)
      .strokeColor(border)
      .roundedRect(40, infoY, 520, 100, 8)
      .stroke();

    doc
      .fillColor(primary)
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('INFORMACIÓN DE LA NÓMINA', 55, infoY + 15);

    doc.font('Helvetica').fontSize(11).fillColor('black');

    doc.text(`ID Nómina: ${nomina.id}`, 55, infoY + 45);

    doc.text(
      `Periodo: ${nomina.periodo}`,
      220,
      infoY + 45,
    );

    doc.text(
      `Estado: ${nomina.estado}`,
      420,
      infoY + 45,
    );

    doc.text(
      `Fecha Inicio: ${new Date(nomina.fecha_inicio).toLocaleDateString()}`,
      55,
      infoY + 70,
    );

    doc.text(
      `Fecha Fin: ${new Date(nomina.fecha_fin).toLocaleDateString()}`,
      300,
      infoY + 70,
    );

    doc.moveDown(5);

    doc
      .fillColor(primary)
      .font('Helvetica-Bold')
      .fontSize(15)
      .text('DETALLE DE EMPLEADOS');

    doc.moveDown(1);


    const tableTop = doc.y;

    doc
      .rect(40, tableTop, 520, 28)
      .fill(secondary);

    doc
      .fillColor('white')
      .fontSize(9)
      .font('Helvetica-Bold');

    doc.text('EMPLEADO', 45, tableTop + 9);
    doc.text('CARGO', 145, tableTop + 9);
    doc.text('BASE', 240, tableTop + 9);
    doc.text('BONOS', 305, tableTop + 9);
    doc.text('IGSS', 370, tableTop + 9);
    doc.text('HORAS EXTRA', 425, tableTop + 9);
    doc.text('TOTAL', 510, tableTop + 9);

    let y = tableTop + 28;

    detalles.forEach((d, index) => {

      const empleado = d.empleados;

      const salarioBase = Number(d.salario_base || 0);
      const bonificaciones = Number(d.bonificaciones || 0);
      const igss = Number(d.igss || 0);
      const salarioFinal = Number(d.salario_final || 0);

      const fondo = index % 2 === 0 ? '#FFFFFF' : '#F8FAFC';

      // Fondo fila

      doc
        .rect(40, y, 520, 55)
        .fill(fondo);

      // Bordes

      doc
        .lineWidth(0.5)
        .strokeColor(border)
        .rect(40, y, 520, 55)
        .stroke();

      // Nombre empleado

      doc
        .fillColor(primary)
        .font('Helvetica-Bold')
        .fontSize(9)
        .text(
          `${empleado.nombres} ${empleado.apellidos}`,
          45,
          y + 8,
          {
            width: 90,
          },
        );

      // Datos secundarios

      doc
        .fillColor(gray)
        .font('Helvetica')
        .fontSize(7)
        .text(
          `ID: ${empleado.id}`,
          45,
          y + 28,
        );

      // Cargo

      doc
        .fillColor('black')
        .fontSize(8)
        .text(
          empleado.cargo || 'No asignado',
          145,
          y + 18,
          {
            width: 80,
          },
        );

      // Salario base

      doc
        .text(
          `Q${salarioBase.toFixed(2)}`,
          240,
          y + 18,
        );

      // Bonos

      doc
        .text(
          `Q${bonificaciones.toFixed(2)}`,
          305,
          y + 18,
        );

      // IGSS

      doc
        .fillColor('#DC2626')
        .text(
          `Q${igss.toFixed(2)}`,
          370,
          y + 18,
        );

      // Horas extra

      doc
        .fillColor('black')
        .text(
          `${d.horas_extra || 0} hrs`,
          435,
          y + 18,
        );
      doc
        .fillColor(success)
        .font('Helvetica-Bold')
        .fontSize(10)
        .text(
          `Q${salarioFinal.toFixed(2)}`,
          500,
          y + 18,
        );

      y += 55;

      if (y > 720) {

        doc.addPage();

        y = 60;

        doc
          .rect(40, y, 520, 28)
          .fill(secondary);

        doc
          .fillColor('white')
          .fontSize(9)
          .font('Helvetica-Bold');

        doc.text('EMPLEADO', 45, y + 9);
        doc.text('CARGO', 145, y + 9);
        doc.text('BASE', 240, y + 9);
        doc.text('BONOS', 305, y + 9);
        doc.text('IGSS', 370, y + 9);
        doc.text('HORAS EXTRA', 425, y + 9);
        doc.text('TOTAL', 510, y + 9);

        y += 28;
      }
    });

    y += 25;

    doc
      .roundedRect(320, y, 240, 90, 8)
      .fill('#ECFDF5');

    doc
      .lineWidth(1)
      .strokeColor('#BBF7D0')
      .roundedRect(320, y, 240, 90, 8)
      .stroke();

    doc
      .fillColor(success)
      .font('Helvetica-Bold')
      .fontSize(14)
      .text(
        'RESUMEN GENERAL',
        340,
        y + 15,
      );

    doc
      .fillColor('black')
      .font('Helvetica')
      .fontSize(11)
      .text(
        `Empleados Procesados: ${detalles.length}`,
        340,
        y + 42,
      );

    doc
      .font('Helvetica-Bold')
      .fontSize(15)
      .fillColor(success)
      .text(
        `TOTAL: Q${totalPlanilla.toFixed(2)}`,
        340,
        y + 62,
      );

    const pages = doc.bufferedPageRange();

    for (let i = 0; i < pages.count; i++) {

      doc.switchToPage(i);

      doc
        .fontSize(8)
        .fillColor(gray)
        .text(
          `Página ${i + 1} de ${pages.count}`,
          40,
          770,
          {
            align: 'center',
          },
        );

      doc
        .text(
          'Documento confidencial - Recursos Humanos',
          40,
          785,
          {
            align: 'center',
          },
        );
    }

    doc.end();
  }
}