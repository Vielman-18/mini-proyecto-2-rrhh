import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { empleadoSchema } from '../echemas/empleado.schema';

import {
  type EmpleadoBackend,
  type Empleado,
  type EstadoEmpleado,
  type Departamento,
  type Puesto,
  empleadoInicial,
} from '../types/empleado';

export function useEmpleados() {
  const [empleados, setEmpleados] = useState<EmpleadoBackend[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [form, setForm] = useState<Empleado>(empleadoInicial);
  const [editando, setEditando] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cargarDepartamentos = async () => {
    try {
      const res = await api.get('/departamentos');
      setDepartamentos(res.data);
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error('Error al cargar departamentos');
    }
  };

  const cargarPuestos = async (departamento_id?: number) => {
    try {
      const url = departamento_id
        ? `/puestos?departamento_id=${departamento_id}`
        : '/puestos';

      const res = await api.get(url);
      setPuestos(res.data);
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error('Error al cargar puestos');
    }
  };

  const cargarEmpleados = async () => {
    try {
      setLoading(true);
      const res = await api.get('/empleados');
      setEmpleados(res.data);
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error('Error al cargar empleados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEmpleados();
    cargarDepartamentos();
    cargarPuestos();
  }, []);

  /* =========================
     VALIDACIÓN ZOD + NEGOCIO
  ========================= */
const validarFormulario = () => {
  const result = empleadoSchema.safeParse(form);
  const newErrors: Record<string, string> = {};

  // =========================
  // ZOD VALIDATION
  // =========================
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const path = issue.path[0] as string;
      newErrors[path] = issue.message;
    });

    setErrors(newErrors);
    toast.error(result.error.issues[0].message);
    return false;
  }

  // =========================
  // DPI: sin espacios + único
  // =========================
  const dpiLimpio = form.dpi.replace(/\s/g, '');

  const dpiExiste = empleados.some((emp) => {
    if (editando !== null && emp.id === editando) return false;
    return emp.dpi?.replace(/\s/g, '') === dpiLimpio;
  });

  if (dpiExiste) {
    newErrors['dpi'] = 'Ya existe un empleado con este DPI';
  }

  if (/\s/.test(form.dpi)) {
    newErrors['dpi'] = 'El DPI no puede contener espacios';
  }

  // =========================
  // EMAIL: formato + único
  // =========================
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (form.email && !emailRegex.test(form.email)) {
    newErrors['email'] = 'Correo electrónico inválido';
  }

  const emailExiste = empleados.some((emp) => {
    if (editando !== null && emp.id === editando) return false;
    return emp.email?.toLowerCase() === form.email?.toLowerCase();
  });

  if (emailExiste) {
    newErrors['email'] = 'Este correo ya está registrado';
  }

  // =========================
  // EDAD: 18 a 182 años
  // =========================
  if (form.fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(form.fechaNacimiento);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    if (edad < 18 || edad > 182) {
      newErrors['fechaNacimiento'] =
        'La edad debe estar entre 18 y 182 años';
    }
  }

  // =========================
  // RETURN ERRORS
  // =========================
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    toast.error(Object.values(newErrors)[0]);
    return false;
  }

  setErrors({});
  return true;
};
  /* =========================
     GUARDAR
  ========================= */
  const guardarEmpleado = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const payload = {
      nombres: form.nombres.trim(),
      apellidos: form.apellidos.trim(),
      dpi: form.dpi.trim(),
      fechaNacimiento: form.fechaNacimiento || undefined,
      direccion: form.direccion || undefined,
      telefono: form.telefono || undefined,
      email: form.email || undefined,
      salario: Number(form.salario),
      departamento_id:
        form.departamento_id && form.departamento_id > 0
          ? Number(form.departamento_id)
          : undefined,
      puesto_id:
        form.puesto_id && form.puesto_id > 0
          ? Number(form.puesto_id)
          : undefined,
    };

    try {
      if (editando !== null) {
        await api.put(`/empleados/${editando}`, payload);
        toast.success('Empleado actualizado');
      } else {
        await api.post('/empleados', payload);
        toast.success('Empleado creado');
      }

      setForm(empleadoInicial);
      setEditando(null);
      setErrors({});
      cargarEmpleados();
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error(
        error.response?.data?.message?.[0] ||
          error.response?.data?.message ||
          'Error al guardar empleado',
      );
    }
  };

  const editarEmpleado = async (emp: EmpleadoBackend) => {
    if (emp.departamento_id) {
      await cargarPuestos(emp.departamento_id);
    }

    setForm({
      id: emp.id,
      nombres: emp.nombres || '',
      apellidos: emp.apellidos || '',
      dpi: emp.dpi || '',
      fechaNacimiento: emp.fecha_nacimiento
        ? emp.fecha_nacimiento.substring(0, 10)
        : '',
      direccion: emp.direccion || '',
      telefono: emp.telefono || '',
      email: emp.email || '',
      salario: String(emp.salario || ''),
      departamento_id: emp.departamento_id ?? 0,
      puesto_id: emp.puesto_id ?? 0,
      estado: emp.estado || 'activo',
    });

    setEditando(emp.id);
  };

  const eliminarEmpleado = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este empleado?')) return;

    try {
      await api.delete(`/empleados/${id}`);
      toast.success('Empleado eliminado');
      cargarEmpleados();
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error('No se pudo eliminar el empleado');
    }
  };

  const cambiarEstado = async (id: number, estado: EstadoEmpleado) => {
    try {
      await api.put(`/empleados/${id}/estado`, { estado });
      toast.success('Estado actualizado');
      cargarEmpleados();
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error('No se pudo cambiar el estado');
    }
  };

  const handleDepartamentoChange = async (value: string) => {
    const departamento_id = value ? Number(value) : null;

    setForm({
      ...form,
      departamento_id,
      puesto_id: null,
    });

    if (departamento_id && !Number.isNaN(departamento_id)) {
      await cargarPuestos(departamento_id);
    } else {
      setPuestos([]);
    }
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setForm(empleadoInicial);
    setErrors({});
  };

  return {
    empleados,
    departamentos,
    puestos,
    form,
    setForm,
    editando,
    setEditando,
    loading,
    guardarEmpleado,
    editarEmpleado,
    eliminarEmpleado,
    cambiarEstado,
    handleDepartamentoChange,
    cargarPuestos,
    errors,
    cancelarEdicion,
  };
}
