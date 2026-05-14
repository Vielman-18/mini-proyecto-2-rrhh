import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

type Empleado = {
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
  estado: string;
};

type Academico = {
  id: number;
  titulo: string;
  institucion: string;
  fecha_graduacion: string | null;
};

type Documento = {
  id: number;
  nombre_archivo?: string;
  nombre?: string;
  tipo_documento?: string;
  tipo?: string;
  fecha_carga?: string | null;
  fechaCreacion?: string | null;
};

type Nomina = {
  id: number;
  salario_base?: number | string;
  salarioBase?: number | string;
  horas_trabajadas?: number | string;
  horasTrabajadas?: number | string;
  horas_extra?: number | string;
  horasExtra?: number | string;
  bonificaciones?: number | string;
  deducciones?: number | string;
  salario_final?: number | string;
  totalPagar?: number | string;
  total?: number | string;
};

export default function EmpleadoHome() {
  const navigate = useNavigate();

  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [academico, setAcademico] = useState<Academico[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [nominas, setNominas] = useState<Nomina[]>([]);
  const [loading, setLoading] = useState(false);

  const cerrarSesion = () => {
    localStorage.clear();
    toast.success('Sesión cerrada');
    navigate('/');
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const correoUsuario = localStorage.getItem('correo');
      const empleadoIdGuardado = localStorage.getItem('empleadoId');

      const resEmpleados = await api.get('/empleados');

      let encontrado: Empleado | undefined;

      if (empleadoIdGuardado) {
        encontrado = resEmpleados.data.find(
          (e: Empleado) => e.id === Number(empleadoIdGuardado),
        );
      }

      if (!encontrado && correoUsuario) {
        encontrado = resEmpleados.data.find(
          (e: Empleado) =>
            e.email?.toLowerCase() === correoUsuario.toLowerCase(),
        );
      }

      if (!encontrado) {
        setEmpleado(null);
        toast.error('No se encontró información del empleado');
        return;
      }

      setEmpleado(encontrado);
      const id = encontrado.id;

      try {
        const resAcademico = await api.get(`/academico/empleado/${id}`);
        setAcademico(resAcademico.data);
      } catch {
        setAcademico([]);
      }

      try {
        const resDocs = await api.get(`/expedientes/empleado/${id}`);
        setDocumentos(resDocs.data);
      } catch {
        try {
          const resDocsAlt = await api.get('/expedientes');
          const filtrados = resDocsAlt.data.filter(
            (d: any) => d.empleado_id === id || d.empleadoId === id,
          );
          setDocumentos(filtrados);
        } catch {
          setDocumentos([]);
        }
      }

      try {
        const resNomina = await api.get(`/nomina/empleado/${id}`);
        setNominas(resNomina.data);
      } catch {
        try {
          const resNominaAlt = await api.get('/nomina');
          const detalles: Nomina[] = [];

          resNominaAlt.data.forEach((n: any) => {
            if (Array.isArray(n.detalle_nomina)) {
              n.detalle_nomina.forEach((d: any) => {
                if (d.empleado_id === id || d.empleadoId === id) {
                  detalles.push(d);
                }
              });
            }

            if (n.empleado_id === id || n.empleadoId === id) {
              detalles.push(n);
            }
          });

          setNominas(detalles);
        } catch {
          setNominas([]);
        }
      }
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error('Error al cargar información');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(34,211,238,0.25),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.22),transparent_35%)]" />
        <div className="relative rounded-[2rem] border border-cyan-400/20 bg-slate-950/80 px-10 py-8 shadow-2xl shadow-cyan-950/40">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-cyan-300">
            UMG
          </p>
          <h1 className="mt-3 text-2xl font-black">
            Cargando panel del empleado...
          </h1>
        </div>
      </div>
    );
  }

  if (!empleado) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] p-6 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(34,211,238,0.22),transparent_30%)]" />
        <div className="relative max-w-xl rounded-[2rem] border border-red-400/20 bg-slate-950/80 p-8 text-center shadow-2xl shadow-red-950/30">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-red-300">
            UMG RRHH
          </p>
          <h1 className="mt-3 text-3xl font-black">
            No se encontró información del empleado
          </h1>
          <button
            onClick={cerrarSesion}
            className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-6 py-3 font-bold text-red-300 transition hover:bg-red-500/20"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  const nombreCompleto = `${empleado.nombres} ${empleado.apellidos}`;
  const salario = Number(empleado.salario || 0).toLocaleString();
  const ultimoPago = nominas[0]
    ? Number(
        nominas[0].salario_final ||
          nominas[0].totalPagar ||
          nominas[0].total ||
          0,
      ).toLocaleString()
    : '0';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] px-5 py-6 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.24),transparent_30%),radial-gradient(circle_at_85%_18%,rgba(139,92,246,0.22),transparent_28%),radial-gradient(circle_at_50%_95%,rgba(37,99,235,0.16),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:52px_52px]" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-7">
        <header className="relative overflow-hidden rounded-[2.2rem] border border-cyan-400/20 bg-slate-950/80 p-7 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] border border-cyan-300/40 bg-cyan-400/10 shadow-xl shadow-cyan-500/20">
                <span className="text-3xl font-black text-cyan-300">UMG</span>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.4em] text-cyan-300">
                  Universidad Mariano Gálvez
                </p>

                <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                  Bienvenido, {empleado.nombres}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                  Portal personal de Recursos Humanos, expediente, formación y nómina.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-3xl border border-cyan-400/15 bg-white/[0.04] px-5 py-4">
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  Usuario
                </p>
                <p className="mt-1 max-w-[260px] truncate text-sm font-bold text-cyan-300">
                  {empleado.email || 'Sin correo'}
                </p>
              </div>

              <button
                onClick={cerrarSesion}
                className="rounded-2xl border border-red-400/30 bg-red-500/10 px-6 py-4 font-bold text-red-300 transition hover:-translate-y-0.5 hover:bg-red-500/20"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Card
            titulo="Empleado"
            valor={nombreCompleto}
            detalle={`DPI: ${empleado.dpi}`}
            tono="cyan"
          />
          <Card
            titulo="Cargo"
            valor={empleado.cargo || 'Sin cargo'}
            detalle={empleado.departamento || 'Sin departamento'}
            tono="blue"
          />
          <Card
            titulo="Estado"
            valor={empleado.estado}
            detalle="Situación laboral"
            tono="emerald"
          />
          <Card
            titulo="Salario"
            valor={`Q${salario}`}
            detalle="Salario registrado"
            tono="violet"
          />
        </section>

        <section className="grid gap-7 xl:grid-cols-[0.85fr_1.15fr]">
          <Panel titulo="Perfil del empleado" subtitulo="Información principal">
            <div className="flex flex-col items-center rounded-[2rem] border border-cyan-400/15 bg-cyan-400/[0.04] p-7 text-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-cyan-300/30 bg-cyan-400/10 text-4xl font-black text-cyan-300 shadow-xl shadow-cyan-500/20">
                {empleado.nombres.charAt(0)}
                {empleado.apellidos.charAt(0)}
              </div>

              <h2 className="mt-5 text-3xl font-black">{nombreCompleto}</h2>
              <p className="mt-2 text-sm text-slate-400">
                {empleado.cargo || 'Empleado'} ·{' '}
                {empleado.departamento || 'Sin departamento'}
              </p>

              <div className="mt-6 grid w-full gap-3">
                <Info label="Correo" value={empleado.email || 'Sin correo'} />
                <Info label="Teléfono" value={empleado.telefono || 'Sin teléfono'} />
                <Info label="Dirección" value={empleado.direccion || 'Sin dirección'} />
              </div>
            </div>
          </Panel>

          <div className="grid gap-7 lg:grid-cols-2">
            <Panel titulo="Datos personales" subtitulo="Registro del colaborador">
              <Info label="Nombre completo" value={nombreCompleto} />
              <Info
                label="Fecha nacimiento"
                value={empleado.fecha_nacimiento?.substring(0, 10) || 'Sin fecha'}
              />
              <Info label="DPI" value={empleado.dpi} />
              <Info label="Correo" value={empleado.email || 'Sin correo'} />
            </Panel>

            <Panel titulo="Información laboral" subtitulo="Estado actual">
              <Info label="Cargo" value={empleado.cargo || 'Sin cargo'} />
              <Info
                label="Departamento"
                value={empleado.departamento || 'Sin departamento'}
              />
              <Info label="Estado" value={empleado.estado} />
              <Info label="Salario" value={`Q${salario}`} />
            </Panel>
          </div>
        </section>

        <section className="grid gap-7 xl:grid-cols-[1fr_1fr]">
          <Panel titulo="Formación académica" subtitulo="Estudios registrados">
            {academico.length === 0 ? (
              <Empty text="No hay información académica registrada." />
            ) : (
              <div className="grid gap-4">
                {academico.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-3xl border border-cyan-400/15 bg-black/30 p-5 transition hover:-translate-y-0.5 hover:bg-cyan-400/[0.04]"
                  >
                    <p className="text-lg font-black text-cyan-300">
                      {a.titulo}
                    </p>
                    <p className="mt-1 text-slate-400">{a.institucion}</p>
                    <p className="mt-3 text-sm text-slate-500">
                      Graduación:{' '}
                      {a.fecha_graduacion?.substring(0, 10) || 'Sin fecha'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel titulo="Expediente" subtitulo="Documentos registrados">
            {documentos.length === 0 ? (
              <Empty text="No hay documentos de expediente registrados." />
            ) : (
              <div className="space-y-3">
                {documentos.map((d) => (
                  <div
                    key={d.id}
                    className="flex flex-col gap-3 rounded-3xl border border-blue-400/15 bg-black/30 p-5 transition hover:-translate-y-0.5 hover:bg-blue-400/[0.04] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-black text-white">
                        {d.nombre_archivo || d.nombre || 'Documento'}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {d.tipo_documento || d.tipo || 'Sin tipo'}
                      </p>
                    </div>

                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-300">
                      {(d.fecha_carga || d.fechaCreacion)?.substring(0, 10) ||
                        'Sin fecha'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </section>

        <Panel titulo="Nómina" subtitulo={`Último total registrado: Q${ultimoPago}`}>
          {nominas.length === 0 ? (
            <Empty text="No hay registros de nómina disponibles." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-cyan-400/10 bg-cyan-400/[0.04] text-left text-xs uppercase tracking-widest text-slate-500">
                    <th className="p-4">Salario base</th>
                    <th className="p-4">Horas</th>
                    <th className="p-4">Extras</th>
                    <th className="p-4">Bonos</th>
                    <th className="p-4">Deducciones</th>
                    <th className="p-4">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {nominas.map((n) => (
                    <tr
                      key={n.id}
                      className="border-b border-cyan-400/5 transition hover:bg-cyan-400/[0.04]"
                    >
                      <td className="p-4 text-slate-300">
                        Q
                        {Number(
                          n.salario_base || n.salarioBase || 0,
                        ).toLocaleString()}
                      </td>

                      <td className="p-4 text-slate-300">
                        {n.horas_trabajadas || n.horasTrabajadas || 0}
                      </td>

                      <td className="p-4 text-slate-300">
                        {n.horas_extra || n.horasExtra || 0}
                      </td>

                      <td className="p-4 font-bold text-emerald-300">
                        Q{Number(n.bonificaciones || 0).toLocaleString()}
                      </td>

                      <td className="p-4 font-bold text-red-300">
                        Q{Number(n.deducciones || 0).toLocaleString()}
                      </td>

                      <td className="p-4 text-lg font-black text-cyan-300">
                        Q
                        {Number(
                          n.salario_final || n.totalPagar || n.total || 0,
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Card({
  titulo,
  valor,
  detalle,
  tono,
}: {
  titulo: string;
  valor: string;
  detalle: string;
  tono: 'cyan' | 'blue' | 'emerald' | 'violet';
}) {
  const colores = {
    cyan: 'border-cyan-400/20 text-cyan-300 shadow-cyan-950/30',
    blue: 'border-blue-400/20 text-blue-300 shadow-blue-950/30',
    emerald: 'border-emerald-400/20 text-emerald-300 shadow-emerald-950/30',
    violet: 'border-violet-400/20 text-violet-300 shadow-violet-950/30',
  };

  return (
    <div
      className={`rounded-[1.8rem] border bg-slate-950/75 p-6 shadow-xl backdrop-blur-xl ${colores[tono]}`}
    >
      <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">
        {titulo}
      </p>
      <h3 className={`mt-3 line-clamp-2 text-2xl font-black ${colores[tono]}`}>
        {valor}
      </h3>
      <p className="mt-2 text-sm text-slate-500">{detalle}</p>
    </div>
  );
}

function Panel({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string;
  subtitulo?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-cyan-400/15 bg-slate-950/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="mb-6 border-b border-cyan-400/10 pb-4">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
          UMG
        </p>
        <h2 className="mt-2 text-2xl font-black text-white">{titulo}</h2>
        {subtitulo && <p className="mt-1 text-sm text-slate-500">{subtitulo}</p>}
      </div>

      {children}
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3 rounded-2xl border border-cyan-400/10 bg-black/30 p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-700 bg-black/30 p-8 text-center text-slate-500">
      {text}
    </div>
  );
}