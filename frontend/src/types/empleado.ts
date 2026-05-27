export type EstadoEmpleado = 'activo' | 'suspendido' | 'retirado';

export type Empleado = {
  id?: number;
  nombres: string;
  apellidos: string;
  dpi: string;
  fechaNacimiento: string;
  direccion: string;
  telefono: string;
  email: string;
  salario: string;
  departamento_id?: number | null;
  puesto_id?: number | null;
  estado?: EstadoEmpleado;
};

export type EmpleadoBackend = {
  id: number;
  nombres: string;
  apellidos: string;
  dpi: string;
  fecha_nacimiento: string | null;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  salario: number | string;
  departamento_id?: number | null;
  puesto_id?: number | null;
  estado: EstadoEmpleado;
  departamentos?: {
    id: number;
    nombre: string;
  } | null;
  puestos?: {
    id: number;
    nombre: string;
  } | null;
};

export type Departamento = {
  id: number;
  nombre: string;
  descripcion?: string | null;
  estado: string;
  fecha_creacion?: string;
};

export type Puesto = {
  id: number;
  nombre: string;
  descripcion?: string | null;
  departamento_id: number;
  estado: string;
  fecha_creacion?: string;
};

export const empleadoInicial: Empleado = {
  nombres: '',
  apellidos: '',
  dpi: '',
  fechaNacimiento: '',
  direccion: '',
  telefono: '',
  email: '',
  salario: '',
  departamento_id: null,
  puesto_id: null,
  estado: 'activo',
};

