import { Injectable } from '@nestjs/common';

export interface ReporteNomina {
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

export interface ReporteExpediente {
  empleadoId: number;
  nombres: string;
  apellidos: string;
  estado: string;
  documentosFaltantes: string[];
}

@Injectable()
export class ReportesService {
  private nominaData: ReporteNomina[] = [];
  private expedientesData: ReporteExpediente[] = [];

  agregarReporteNomina(data: ReporteNomina) {
    this.nominaData.push(data);
    return data;
  }

  obtenerReportesNomina(periodo?: string) {
    if (periodo) {
      return this.nominaData.filter(r => r.periodo === periodo);
    }
    return this.nominaData;
  }

  obtenerReporteExpedientes() {
    return this.expedientesData;
  }

  agregarReporteExpediente(data: ReporteExpediente) {
    this.expedientesData.push(data);
    return data;
  }

  generarResumenNomina(periodo: string) {
    const nominas = this.nominaData.filter(r => r.periodo === periodo);
    const totalGeneral = nominas.reduce((acc, n) => acc + n.totalPagar, 0);
    const totalDeducciones = nominas.reduce((acc, n) => acc + n.deducciones, 0);
    const totalBonificaciones = nominas.reduce((acc, n) => acc + n.bonificaciones, 0);

    return {
      periodo,
      totalEmpleados: nominas.length,
      totalGeneral,
      totalDeducciones,
      totalBonificaciones,
      detalle: nominas,
    };
  }
}