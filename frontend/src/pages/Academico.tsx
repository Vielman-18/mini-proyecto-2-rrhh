import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

type Empleado = {
  id: number;
  nombres: string;
  apellidos: string;
  dpi: string;
};

type RegistroAcademico = {
  id: number;
  empleado_id: number;
  titulo: string;
  institucion: string;
  fecha_graduacion: string | null;
  empleados?: Empleado;
};

type FormAcademico = {
  empleado_id: string;
  titulo: string;
  institucion: string;
  fecha_graduacion: string;
};

const formInicial: FormAcademico = {
  empleado_id: '',
  titulo: '',
  institucion: '',
  fecha_graduacion: '',
};

export default function Academico() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [registros, setRegistros] = useState<RegistroAcademico[]>([]);
  const [form, setForm] = useState<FormAcademico>(formInicial);
  const [loading, setLoading] = useState(false);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const [resEmpleados, resAcademico] = await Promise.all([
        api.get('/empleados'),
        api.get('/academico'),
      ]);

      setEmpleados(resEmpleados.data);
      setRegistros(resAcademico.data);
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error('Error al cargar información académica');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const guardarAcademico = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.empleado_id) {
      toast.error('Selecciona un empleado');
      return;
    }

    if (!form.titulo.trim()) {
      toast.error('El título académico es obligatorio');
      return;
    }

    if (!form.institucion.trim()) {
      toast.error('La institución es obligatoria');
      return;
    }

    const payload = {
      empleado_id: Number(form.empleado_id),
      titulo: form.titulo.trim(),
      institucion: form.institucion.trim(),
      fecha_graduacion: form.fecha_graduacion || null,
    };

    try {
      await api.post('/academico', payload);

      toast.success('Registro académico guardado');
      setForm(formInicial);
      cargarDatos();
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error(
        error.response?.data?.message?.[0] ||
          error.response?.data?.message ||
          'Error al guardar registro académico',
      );
    }
  };

  const eliminarRegistro = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este registro académico?')) return;

    try {
      await api.delete(`/academico/${id}`);
      toast.success('Registro académico eliminado');
      cargarDatos();
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error('No se pudo eliminar el registro');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] p-6 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.23),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.22),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(37,99,235,0.18),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:54px_54px]" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-[2.2rem] border border-cyan-400/20 bg-slate-950/80 p-8 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] border border-cyan-300/40 bg-cyan-400/10 shadow-xl shadow-cyan-500/20">
              <span className="text-3xl font-black text-cyan-300">UMG</span>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-cyan-300">
                Universidad Mariano Gálvez
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                Información Académica
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                Registro de títulos, certificaciones e instituciones por empleado.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
          <form
            onSubmit={guardarAcademico}
            className="rounded-[2rem] border border-cyan-400/15 bg-slate-950/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl"
          >
            <div className="mb-6 border-b border-cyan-400/10 pb-5">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
                Nuevo registro
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                Formación académica
              </h2>
            </div>

            <div className="space-y-5">
              <Field label="Empleado">
                <select
                  value={form.empleado_id}
                  onChange={(e) =>
                    setForm({ ...form, empleado_id: e.target.value })
                  }
                  className="input-futurista"
                >
                  <option value="">Seleccione un empleado</option>
                  {empleados.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nombres} {emp.apellidos} - {emp.dpi}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Título o certificación">
                <input
                  type="text"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ej: Ingeniería en Sistemas"
                  className="input-futurista"
                />
              </Field>

              <Field label="Institución educativa">
                <input
                  type="text"
                  value={form.institucion}
                  onChange={(e) =>
                    setForm({ ...form, institucion: e.target.value })
                  }
                  placeholder="Ej: Universidad Mariano Gálvez"
                  className="input-futurista"
                />
              </Field>

              <Field label="Fecha de graduación">
                <input
                  type="date"
                  value={form.fecha_graduacion}
                  onChange={(e) =>
                    setForm({ ...form, fecha_graduacion: e.target.value })
                  }
                  className="input-futurista"
                />
              </Field>

              <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                <button
                  type="submit"
                  className="flex-1 rounded-2xl border border-cyan-300/30 bg-cyan-400 px-6 py-4 font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-300"
                >
                  Guardar registro
                </button>

                <button
                  type="button"
                  onClick={() => setForm(formInicial)}
                  className="rounded-2xl border border-slate-700 bg-slate-900 px-6 py-4 font-bold text-slate-300 transition hover:bg-slate-800"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </form>

          <section className="overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-slate-950/80 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="flex flex-col gap-2 border-b border-cyan-400/10 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
                  UMG Académico
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  Registros académicos
                </h2>
              </div>

              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300">
                {loading ? 'Cargando...' : `${registros.length} registros`}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-cyan-400/[0.04]">
                    {[
                      'Empleado',
                      'Título / Certificación',
                      'Institución',
                      'Fecha',
                      'Acción',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {registros.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-cyan-400/5 transition hover:bg-cyan-400/[0.04]"
                    >
                      <td className="px-5 py-5">
                        <p className="font-bold text-white">
                          {item.empleados
                            ? `${item.empleados.nombres} ${item.empleados.apellidos}`
                            : `Empleado ID: ${item.empleado_id}`}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.empleados?.dpi || 'Sin DPI'}
                        </p>
                      </td>

                      <td className="px-5 py-5 text-sm font-bold text-cyan-300">
                        {item.titulo}
                      </td>

                      <td className="px-5 py-5 text-sm text-slate-400">
                        {item.institucion}
                      </td>

                      <td className="px-5 py-5 text-sm text-slate-400">
                        {item.fecha_graduacion
                          ? item.fecha_graduacion.substring(0, 10)
                          : 'Sin fecha'}
                      </td>

                      <td className="px-5 py-5">
                        <button
                          type="button"
                          onClick={() => eliminarRegistro(item.id)}
                          className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/20"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!loading && registros.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-12 text-center text-sm text-slate-500"
                      >
                        No hay registros académicos.
                      </td>
                    </tr>
                  )}

                  {loading && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-12 text-center text-sm text-slate-500"
                      >
                        Cargando información académica...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-300">
        {label}
      </label>
      {children}
    </div>
  );
}