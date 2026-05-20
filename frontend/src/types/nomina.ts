export type Empleado = {
  id: number;
  nombres: string;
  apellidos: string;
  salario: number | string;
  estado: string;
  cargo?: string;
  departamento?: string;
};

export type Nomina = {
  id: number;
  tipo_periodo: string;
  periodo: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
};

export type DetalleNomina = {
  id: number;
  nomina_id: number;
  empleado_id: number;
  salario_base: number | string;
  horas_trabajadas?: number | string;
  horas_extra?: number | string;
  monto_horas_extra?: number | string;
  bonificaciones?: number | string;
  comisiones?: number | string;
  deducciones?: number | string;
  descuentos_legales?: number | string;
  igss?: number | string;
  irtra?: number | string;
  salario_final: number | string;
  empleados?: Empleado;
};