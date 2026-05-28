import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

type Empleado = {
  id: number;
  nombres: string;
  apellidos: string;
  estado: string;
};

type ReporteNomina = {
  empleadoId: number;
  nombres: string;
  apellidos: string;
  salarioBase: number;
  horasExtra: number;
  bonificaciones: number;
  deducciones: number;
  totalPagar: number;
  periodo: string;
  tipoPeriodo: string;
  estadoNomina: string;
};

type ReporteExpediente = {
  empleadoId: number;
  nombres: string;
  apellidos: string;
  estado: string;
  totalDocumentos: number;
  documentosFaltantes: string[];
};

type ReporteAcademico = {
  empleadoId: number;
  nombres: string;
  apellidos: string;
  totalRegistrosAcademicos: number;
};

type ReporteContratacion = {
  empleadoId: number;
  nombres: string;
  apellidos: string;
  dpi: string;
  estadoLaboral: string;
  tieneDpi: boolean;
  tieneContrato: boolean;
  tieneRegistrosAcademicos: boolean;
  cumpleContratacion: string;
};

type Nomina = {
  id: number;
  tipo_periodo: string;
  periodo: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  fecha_creacion: string;
};

export default function Reportes() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [nomina, setNomina] = useState<ReporteNomina[]>([]);
  const [expedientes, setExpedientes] = useState<ReporteExpediente[]>([]);
  const [academico, setAcademico] = useState<ReporteAcademico[]>([]);
  const [contratacion, setContratacion] = useState<ReporteContratacion[]>([]);
  const [nominas, setNominas] = useState<Nomina[]>([]);
  const [periodo, setPeriodo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
      setLoading(true);
      const [empleadosRes, nominaRes, expedientesRes, academicoRes, contratacionRes, nominasRes] =
        await Promise.all([
          api.get('/empleados'),
          api.get('/reportes/nomina'),
          api.get('/reportes/expedientes'),
          api.get('/reportes/academico'),
          api.get('/reportes/contratacion'),
          api.get('/nomina'),
        ]);
      setEmpleados(empleadosRes.data);
      setNomina(nominaRes.data);
      setExpedientes(expedientesRes.data);
      setAcademico(academicoRes.data);
      setContratacion(contratacionRes.data);
      setNominas(nominasRes.data);
    } catch {
      toast.error('Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  };

  const filtrarNomina = async () => {
    try {
      const res = await api.get('/reportes/nomina', {
        params: periodo ? { periodo } : {},
      });
      setNomina(res.data);
      toast.success('Reporte actualizado');
    } catch {
      toast.error('No se pudo filtrar la nómina');
    }
  };

  const descargarPdfNomina = (id: number) => {
    window.open(`http://localhost:3000/nomina/${id}/pdf`, '_blank');
  };

  const totalEmpleados = empleados.length;
  const activos = empleados.filter((e) => e.estado === 'activo').length;
  const retirados = empleados.filter((e) => e.estado === 'retirado').length;
  const totalNomina = nomina.reduce((acc, item) => acc + Number(item.totalPagar || 0), 0);
  const expedientesCompletos = expedientes.filter((e) => e.totalDocumentos >= 5).length;
  const cumplenContratacion = contratacion.filter((c) => c.cumpleContratacion === 'Cumple').length;
  const nominasCerradas = nominas.filter((n) => n.estado === 'cerrada');

  return (
    <div className="min-h-screen space-y-8 bg-slate-950 p-6 text-white">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Reportes</h1>
          <p className="text-slate-400">Resumen general de empleados, nómina, expedientes y contratación</p>
        </div>
        <button onClick={cargarReportes} disabled={loading}
          className="rounded-xl border border-blue-500/30 bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      <section className="grid gap-5 md:grid-cols-3 xl:grid-cols-6">
        <Card title="Empleados" value={totalEmpleados} icon="👥" />
        <Card title="Activos" value={activos} icon="✅" />
        <Card title="Retirados" value={retirados} icon="🚪" />
        <Card title="Total Nómina" value={`Q${totalNomina.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon="💰" />
        <Card title="Exp. completos" value={expedientesCompletos} icon="📁" />
        <Card title="Cumplen" value={cumplenContratacion} icon="📋" />
      </section>

      <section className="rounded-2xl border border-blue-500/20 bg-slate-900 p-6">
        <h2 className="mb-4 text-xl font-semibold">Filtro de nómina</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <input value={periodo} onChange={(e) => setPeriodo(e.target.value)} placeholder="Ejemplo: Mayo 2026"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500" />
          <button onClick={filtrarNomina} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Filtrar</button>
          <button onClick={() => { setPeriodo(''); cargarReportes(); }}
            className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 hover:bg-slate-800">Limpiar</button>
        </div>
      </section>

      <section className="rounded-2xl border border-green-500/20 bg-slate-900 p-6">
        <h2 className="mb-4 text-xl font-semibold">📄 Nóminas cerradas — PDFs</h2>
        {nominasCerradas.length === 0 ? (
          <p className="text-slate-500">No hay nóminas cerradas disponibles.</p>
        ) : (
          <div className="space-y-3">
            {nominasCerradas.map((n) => (
              <div key={n.id} className="flex flex-col justify-between gap-3 rounded-xl bg-slate-950 p-4 md:flex-row md:items-center">
                <div>
                  <p className="font-semibold text-white">{n.periodo} — {n.tipo_periodo}</p>
                  <p className="text-sm text-slate-400">
                    {new Date(n.fecha_inicio).toLocaleDateString()} al {new Date(n.fecha_fin).toLocaleDateString()}
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">{n.estado}</span>
                </div>
                <button onClick={() => descargarPdfNomina(n.id)}
                  className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400 hover:bg-green-500/20">
                  📥 Descargar PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <Panel title="Reporte de nómina">
          {nomina.length === 0 ? <Empty text="No hay datos de nómina." /> : (
            <div className="space-y-3">
              {nomina.slice(0, 8).map((item, index) => (
                <div key={index} className="rounded-xl bg-slate-950 p-4">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-semibold">{item.nombres} {item.apellidos}</p>
                      <p className="text-sm text-slate-400">{item.periodo} · {item.tipoPeriodo}</p>
                    </div>
                    <p className="font-bold text-green-400">Q{Number(item.totalPagar).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Reporte de expedientes">
          {expedientes.length === 0 ? <Empty text="No hay datos de expedientes." /> : (
            <div className="space-y-3">
              {expedientes.slice(0, 8).map((item) => (
                <div key={item.empleadoId} className="rounded-xl bg-slate-950 p-4">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-semibold">{item.nombres} {item.apellidos}</p>
                      <p className="text-sm text-slate-400">Documentos: {item.totalDocumentos}</p>
                    </div>
                    <span className={`h-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      item.totalDocumentos >= 5 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {item.totalDocumentos >= 5 ? 'Completo' : 'Incompleto'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Reporte académico">
          {academico.length === 0 ? <Empty text="No hay registros académicos." /> : (
            <div className="space-y-3">
              {academico.slice(0, 8).map((item) => (
                <div key={item.empleadoId} className="flex justify-between rounded-xl bg-slate-950 p-4">
                  <span>{item.nombres} {item.apellidos}</span>
                  <span className="text-blue-400">{item.totalRegistrosAcademicos} registros</span>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Reporte de contratación">
          {contratacion.length === 0 ? <Empty text="No hay datos de contratación." /> : (
            <div className="space-y-3">
              {contratacion.slice(0, 8).map((item) => (
                <div key={item.empleadoId} className="rounded-xl bg-slate-950 p-4">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-semibold">{item.nombres} {item.apellidos}</p>
                      <p className="text-sm text-slate-400">DPI: {item.dpi}</p>
                    </div>
                    <span className={`h-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      item.cumpleContratacion === 'Cumple' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {item.cumpleContratacion}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </section>
    </div>
  );
}

function Card({ title, value, icon }: { title: string; value: any; icon: string }) {
  return (
    <div className="rounded-2xl border border-blue-500/20 bg-slate-900 p-5 shadow-lg">
      <div className="mb-3 text-3xl">{icon}</div>
      <div className="break-all text-lg font-bold leading-tight text-blue-400">{value}</div>
      <p className="text-sm text-slate-500">{title}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-blue-500/20 bg-slate-900 p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-slate-500">{text}</p>;
}