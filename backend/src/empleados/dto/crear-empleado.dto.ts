export class CrearEmpleadoDto {
  nombres!: string;
  apellidos!: string;
  dpi!: string;
  fechaNacimiento?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  salario!: number;
  cargo?: string;
  departamento?: string;
}
