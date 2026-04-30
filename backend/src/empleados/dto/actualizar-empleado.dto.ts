import { CrearEmpleadoDto } from './crear-empleado.dto';

export class ActualizarEmpleadoDto implements Partial<CrearEmpleadoDto> {
  nombres?: string;
  apellidos?: string;
  dpi?: string;
  fechaNacimiento?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  salario?: number;
  cargo?: string;
  departamento?: string;
}
