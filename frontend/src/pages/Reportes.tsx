import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Reportes() {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [nominas, setNominas] = useState<any[]>([]);
  const [expedientes, setExpedientes] = useState<any[]>([]);

  useEffect(() => {
    api.get('/empleados').then((res) => setEmpleados(res.data)).catch(() => {});
    api.get('/nomina').then((res) => setNominas(res.data)).catch(() => {});
    api.get('/expedientes').then((res) => setExpedientes(res.data)).catch(() => {});
  }, []);

  const activos = empleados.filter((e) => e.estado === 'activo').length;
  const retirados = empleados.filter((e) => e.estado === 'retirado').length;
  const totalNomina = nominas.reduce((acc, n) => acc + Number(n.totalPagar || n.total || 0), 0);

  const descargarPDF = async () => {
    try {
      const res = await api.get('/reportes/pdf', { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reporte-rrhh.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Reporte descargado');
    } catch {
      toast.error('No se pudo generar el PDF');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Reportes</h1>
        <p className="text-slate-400">Resumen de empleados, nómina y expedientes</p>
      </div>

      <section className="grid gap-5 md:grid-cols-4">
        <Card title="Empleados" value={empleados.length} icon="👥" />
        <Card title="Activos" value={activos} icon="✅" />
        <Card title="Retirados" value={retirados} icon="🚪" />
        <Card title="Total Nómina" value={`Q${totalNomina.toLocaleString()}`} icon="💰" />
      </section>

      <section className="rounded-2xl border border-blue-500/10 bg-slate-950/80 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Acciones</h2>

        <button
          onClick={descargarPDF}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Descargar reporte PDF
        </button>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-blue-500/10 bg-slate-950/80 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Reporte de empleados</h2>

          <div className="space-y-3">
            {empleados.slice(0, 8).map((emp) => (
              <div key={emp.id} className="flex justify-between rounded-xl bg-slate-900 p-4">
                <span className="text-white">{emp.nombres} {emp.apellidos}</span>
                <span className="text-blue-400">{emp.estado}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-blue-500/10 bg-slate-950/80 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Reporte de nómina</h2>

          <div className="space-y-3">
            {nominas.slice(0, 8).map((n, i) => (
              <div key={n.id || i} className="flex justify-between rounded-xl bg-slate-900 p-4">
                <span className="text-white">{n.periodo || 'Periodo'}</span>
                <span className="text-green-400">Q{Number(n.totalPagar || n.total || 0).toFixed(2)}</span>
              </div>
            ))}

            {nominas.length === 0 && (
              <p className="text-slate-500">No hay nóminas registradas.</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-blue-500/10 bg-slate-950/80 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Expedientes registrados</h2>
        <p className="text-slate-400">Total documentos cargados: {expedientes.length}</p>
      </section>
    </div>
  );
}

function Card({ title, value, icon }: any) {
  return (
    <div className="rounded-2xl border border-blue-500/10 bg-slate-950/80 p-6">
      <div className="mb-3 text-3xl">{icon}</div>
      <div className="text-3xl font-bold text-blue-400">{value}</div>
      <p className="text-sm text-slate-500">{title}</p>
    </div>
  );
}