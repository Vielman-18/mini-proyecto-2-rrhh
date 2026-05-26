import { z } from 'zod';

const calcularEdad = (fecha: string) => {
  const hoy = new Date();
  const nacimiento = new Date(fecha);

  let edad = hoy.getFullYear() - nacimiento.getFullYear();

  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
};

export const empleadoSchema = z.object({
  nombres: z.string().min(1, 'El nombre es obligatorio'),
  apellidos: z.string().min(1, 'Los apellidos son obligatorios'),

  dpi: z
    .string()
    .min(1, 'El DPI es obligatorio')
    .regex(/^\d+$/, 'El DPI solo debe contener números')
    .length(13, 'El DPI debe tener exactamente 13 dígitos')
    .refine((val) => !/\s/.test(val), {
      message: 'El DPI no puede contener espacios',
    }),

  fechaNacimiento: z
    .string()
    .min(1, 'La fecha de nacimiento es obligatoria')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Fecha inválida',
    })
    .refine((val) => {
      const edad = calcularEdad(val);
      return edad >= 18 && edad <= 182;
    }, {
      message: 'La edad debe estar entre 18 y 182 años',
    }),

  direccion: z.string().min(1, 'La dirección es obligatoria'),

  telefono: z
    .string()
    .min(1, 'El teléfono es obligatorio')
    .refine((val) => !/\s/.test(val), {
      message: 'El teléfono no puede contener espacios',
    }),

  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('El email no es válido')
    .refine((val) => !/\s/.test(val), {
      message: 'El email no puede contener espacios',
    })
    .toLowerCase(),

  salario: z
    .union([z.string(), z.number()])
    .refine((val) => Number(val) > 0, {
      message: 'El salario debe ser mayor a 0',
    }),

  departamento_id: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({
      message: 'El departamento es obligatorio',
    })
  ),

  puesto_id: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({
      message: 'El puesto es obligatorio',
    })
  ),
});
