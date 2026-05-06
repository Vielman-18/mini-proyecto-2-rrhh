import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

type Empleado = {
  id?: number;
  nombres: string;
  apellidos: string;
  dpi: string;
  fechaNacimiento: string;
  direccion: string;
  telefono: string;
  email: string;
  salario: string;
  cargo: string;
  departamento: string;
  estado?: 'activo' | 'suspendido' | 'retirado';
};

type EmpleadoBackend = {
  id: number;
  nombres: string;
  apellidos: string;
  dpi: string;
  fecha_nacimiento: string | null;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  salario: number | string;
  cargo: string | null;
  departamento: string | null;
  estado: 'activo' | 'suspendido' | 'retirado';
};

const empleadoInicial: Empleado = {
  nombres: '',
  apellidos: '',
  dpi: '',
  fechaNacimiento: '',
  direccion: '',
  telefono: '',
  email: '',
  salario: '',
  cargo: '',
  departamento: '',
  estado: 'activo',
};

export default function Empleados() {
  const [empleados, setEmpleados] = useState<EmpleadoBackend[]>([]);
  const [form, setForm] = useState<Empleado>(empleadoInicial);
  const [editando, setEditando] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

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
  }, []);

  const guardarEmpleado = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.nombres.trim() || !form.apellidos.trim() || !form.dpi.trim()) {
      toast.error('Nombres, apellidos y DPI son obligatorios');
      return;
    }

    if (!form.salario) {
      toast.error('El salario es obligatorio');
      return;
    }

    const payload = {
      nombres: form.nombres.trim(),
      apellidos: form.apellidos.trim(),
      dpi: form.dpi.trim(),
      fechaNacimiento: form.fechaNacimiento || undefined,
      direccion: form.direccion || undefined,
      telefono: form.telefono || undefined,
      email: form.email || undefined,
      salario: Number(form.salario),
      cargo: form.cargo || undefined,
      departamento: form.departamento || undefined,
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
      cargarEmpleados();
    } catch (error: any) {
      console.log('ERROR BACKEND:', error.response?.data);

      toast.error(
        error.response?.data?.message?.[0] ||
          error.response?.data?.message ||
          'Error al guardar empleado',
      );
    }
  };

  const editarEmpleado = (emp: EmpleadoBackend) => {
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
      cargo: emp.cargo || '',
      departamento: emp.departamento || '',
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

  const cambiarEstado = async (
    id: number,
    estado: 'activo' | 'suspendido' | 'retirado',
  ) => {
    try {
      await api.put(`/empleados/${id}/estado`, {
        estado,
      });

      toast.success('Estado actualizado');
      cargarEmpleados();
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error('No se pudo cambiar el estado');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Gestión de Empleados
        </h1>
        <p className="text-slate-400">
          Crear, editar, eliminar y cambiar estado de empleados
        </p>
      </div>

      <form
        onSubmit={guardarEmpleado}
        className="grid gap-4 rounded-2xl border border-blue-500/10 bg-slate-950/80 p-6 shadow-lg shadow-black/10 md:grid-cols-2"
      >
        {[
          ['nombres', 'Nombres'],
          ['apellidos', 'Apellidos'],
          ['dpi', 'DPI'],
          ['fechaNacimiento', 'Fecha nacimiento'],
          ['direccion', 'Dirección'],
          ['telefono', 'Teléfono'],
          ['email', 'Email'],
          ['salario', 'Salario'],
          ['cargo', 'Cargo'],
          ['departamento', 'Departamento'],
        ].map(([name, label]) => (
          <div key={name}>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              {label}
            </label>

            <input
              type={
                name === 'fechaNacimiento'
                  ? 'date'
                  : name === 'salario'
                    ? 'number'
                    : name === 'email'
                      ? 'email'
                      : 'text'
              }
              value={form[name as keyof Empleado] || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  [name]: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>
        ))}

        <div className="flex items-end gap-3 md:col-span-2">
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            {editando ? 'Actualizar empleado' : 'Crear empleado'}
          </button>

          {editando && (
            <button
              type="button"
              onClick={() => {
                setEditando(null);
                setForm(empleadoInicial);
              }}
              className="rounded-xl bg-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-600"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-blue-500/10 bg-slate-950/80 shadow-lg shadow-black/10">
        <div className="flex items-center justify-between border-b border-blue-500/10 px-6 py-5">
          <h2 className="text-xl font-semibold text-white">
            Lista de empleados
          </h2>

          <span className="text-sm text-slate-400">
            {loading ? 'Cargando...' : `${empleados.length} registros`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-500/5">
                {[
                  'Empleado',
                  'DPI',
                  'Contacto',
                  'Cargo',
                  'Departamento',
                  'Salario',
                  'Estado',
                  'Acciones',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {empleados.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-t border-blue-500/5 transition hover:bg-blue-500/5"
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-white">
                        {emp.nombres} {emp.apellidos}
                      </p>
                      <p className="text-xs text-slate-500">
                        {emp.fecha_nacimiento
                          ? emp.fecha_nacimiento.substring(0, 10)
                          : 'Sin fecha'}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-400">
                    {emp.dpi}
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-sm text-slate-400">
                      {emp.telefono || 'Sin teléfono'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {emp.email || 'Sin email'}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-400">
                    {emp.cargo || 'Sin cargo'}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-400">
                    {emp.departamento || 'Sin departamento'}
                  </td>

                  <td className="px-4 py-4 text-sm font-semibold text-blue-400">
                    Q{Number(emp.salario || 0).toLocaleString()}
                  </td>

                  <td className="px-4 py-4">
                    <select
                      value={emp.estado || 'activo'}
                      onChange={(e) =>
                        cambiarEstado(
                          emp.id,
                          e.target.value as
                            | 'activo'
                            | 'suspendido'
                            | 'retirado',
                        )
                      }
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold outline-none ${
                        emp.estado === 'retirado'
                          ? 'border-red-500/20 bg-red-500/10 text-red-400'
                          : emp.estado === 'suspendido'
                            ? 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                            : 'border-green-500/20 bg-green-500/10 text-green-400'
                      }`}
                    >
                      <option value="activo">Activo</option>
                      <option value="suspendido">Suspendido</option>
                      <option value="retirado">Retirado</option>
                    </select>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => editarEmpleado(emp)}
                        className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-400 transition hover:bg-amber-500/20"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => eliminarEmpleado(emp.id)}
                        className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && empleados.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    No hay empleados registrados.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Cargando empleados...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}