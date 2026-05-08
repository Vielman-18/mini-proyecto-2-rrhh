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
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        Cargando panel del empleado...
      </div>
    );
  }

  if (!empleado) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="rounded-3xl border border-blue-500/20 bg-slate-900 p-8">
          No se encontró información del empleado.
        </div>
      </div>
    );
  }

  const nombreCompleto = `${empleado.nombres} ${empleado.apellidos}`;

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 shadow-2xl shadow-blue-950/40">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-400">
                Portal del Empleado
              </p>
              <h1 className="mt-3 text-4xl font-black text-white">
                Bienvenido, {empleado.nombres}
              </h1>
              <p className="mt-2 text-slate-300">
                Panel personal de Recursos Humanos y Nómina
              </p>
            </div>

            <button
              onClick={cerrarSesion}
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 font-semibold text-red-300 transition hover:bg-red-500/20"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <section className="grid gap-5 md:grid-cols-4">
          <Card titulo="Empleado" valor={nombreCompleto} detalle={`DPI: ${empleado.dpi}`} />
          <Card titulo="Cargo" valor={empleado.cargo || 'Sin cargo'} detalle={empleado.departamento || 'Sin departamento'} />
          <Card titulo="Estado" valor={empleado.estado} detalle="Situación laboral actual" />
          <Card titulo="Salario" valor={`Q${Number(empleado.salario || 0).toLocaleString()}`} detalle="Salario registrado" />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel titulo="Datos personales">
            <Info label="Nombre completo" value={nombreCompleto} />
            <Info label="Fecha nacimiento" value={empleado.fecha_nacimiento?.substring(0, 10) || 'Sin fecha'} />
            <Info label="Teléfono" value={empleado.telefono || 'Sin teléfono'} />
            <Info label="Correo" value={empleado.email || 'Sin correo'} />
            <Info label="Dirección" value={empleado.direccion || 'Sin dirección'} />
          </Panel>

          <Panel titulo="Información laboral">
            <Info label="Cargo" value={empleado.cargo || 'Sin cargo'} />
            <Info label="Departamento" value={empleado.departamento || 'Sin departamento'} />
            <Info label="Estado" value={empleado.estado} />
            <Info label="Salario" value={`Q${Number(empleado.salario || 0).toLocaleString()}`} />
          </Panel>
        </section>

        <Panel titulo="Formación académica">
          {academico.length === 0 ? (
            <Empty text="No hay información académica registrada." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {academico.map((a) => (
                <div key={a.id} className="rounded-2xl border border-cyan-500/10 bg-slate-900 p-5">
                  <p className="text-lg font-bold text-cyan-300">{a.titulo}</p>
                  <p className="text-slate-400">{a.institucion}</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Graduación: {a.fecha_graduacion?.substring(0, 10) || 'Sin fecha'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel titulo="Expediente">
          {documentos.length === 0 ? (
            <Empty text="No hay documentos de expediente registrados." />
          ) : (
            <div className="space-y-3">
              {documentos.map((d) => (
                <div key={d.id} className="flex justify-between rounded-2xl border border-blue-500/10 bg-slate-900 p-4">
                  <div>
                    <p className="font-semibold text-white">
                      {d.nombre_archivo || d.nombre || 'Documento'}
                    </p>
                    <p className="text-sm text-slate-400">
                      {d.tipo_documento || d.tipo || 'Sin tipo'}
                    </p>
                  </div>
                  <span className="text-sm text-slate-500">
                    {(d.fecha_carga || d.fechaCreacion)?.substring(0, 10) || 'Sin fecha'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel titulo="Nómina">
          {nominas.length === 0 ? (
            <Empty text="No hay registros de nómina disponibles." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-500/10 text-left text-xs uppercase text-slate-500">
                    <th className="p-3">Salario base</th>
                    <th className="p-3">Horas</th>
                    <th className="p-3">Extras</th>
                    <th className="p-3">Bonos</th>
                    <th className="p-3">Deducciones</th>
                    <th className="p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {nominas.map((n) => (
                    <tr key={n.id} className="border-b border-blue-500/5">
                      <td className="p-3 text-slate-300">Q{Number(n.salario_base || n.salarioBase || 0).toLocaleString()}</td>
                      <td className="p-3 text-slate-300">{n.horas_trabajadas || n.horasTrabajadas || 0}</td>
                      <td className="p-3 text-slate-300">{n.horas_extra || n.horasExtra || 0}</td>
                      <td className="p-3 text-green-400">Q{Number(n.bonificaciones || 0).toLocaleString()}</td>
                      <td className="p-3 text-red-400">Q{Number(n.deducciones || 0).toLocaleString()}</td>
                      <td className="p-3 font-bold text-cyan-300">
                        Q{Number(n.salario_final || n.totalPagar || n.total || 0).toLocaleString()}
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
}: {
  titulo: string;
  valor: string;
  detalle: string;
}) {
  return (
    <div className="rounded-3xl border border-blue-500/10 bg-slate-900/90 p-5 shadow-xl shadow-black/20">
      <p className="text-xs uppercase tracking-widest text-cyan-400">{titulo}</p>
      <h3 className="mt-3 text-xl font-bold text-white">{valor}</h3>
      <p className="mt-1 text-sm text-slate-500">{detalle}</p>
    </div>
  );
}

function Panel({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-blue-500/10 bg-slate-950/80 p-6 shadow-xl shadow-black/20">
      <h2 className="mb-5 border-b border-blue-500/10 pb-3 text-xl font-bold text-white">
        {titulo}
      </h2>
      {children}
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3 rounded-2xl border border-cyan-500/10 bg-slate-900 p-4">
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center text-slate-500">
      {text}
    </div>
  );
}