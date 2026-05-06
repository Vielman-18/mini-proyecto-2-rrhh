import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/empleados')
      .then((res) => setEmpleados(res.data))
      .finally(() => setLoading(false));
  }, []);

  const activos = empleados.filter((e) => e.estado === 'activo').length;
  const suspendidos = empleados.filter((e) => e.estado === 'suspendido').length;
  const retirados = empleados.filter((e) => e.estado === 'retirado').length;
  const totalSalarios = empleados.reduce((acc, e) => acc + Number(e.salario || 0), 0);

  const stats = [
    ['Total Empleados', loading ? '...' : empleados.length, '👥', 'text-blue-400'],
    ['Activos', loading ? '...' : activos, '✅', 'text-green-400'],
    ['Suspendidos', loading ? '...' : suspendidos, '⚠️', 'text-amber-400'],
    ['Retirados', loading ? '...' : retirados, '🚪', 'text-red-400'],
    ['Masa Salarial', loading ? '...' : `Q${totalSalarios.toLocaleString()}`, '💰', 'text-purple-400'],
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/15 to-blue-950/20 p-8">
        <h1 className="text-3xl font-bold text-white">Dashboard RRHH</h1>
        <p className="mt-2 text-slate-400">
          Resumen general del sistema de recursos humanos.
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(([label, value, icon, color]) => (
          <div key={label} className="rounded-2xl border border-blue-500/10 bg-slate-950/80 p-6">
            <div className="mb-3 text-3xl">{icon}</div>
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-blue-500/10 bg-slate-950/80 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Empleados recientes</h2>

        <div className="space-y-3">
          {empleados.slice(0, 5).map((emp) => (
            <div key={emp.id} className="flex items-center justify-between rounded-xl bg-slate-900 p-4">
              <div>
                <p className="font-semibold text-white">{emp.nombres} {emp.apellidos}</p>
                <p className="text-sm text-slate-400">{emp.cargo} - {emp.departamento}</p>
              </div>
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-400">
                {emp.estado}
              </span>
            </div>
          ))}

          {!loading && empleados.length === 0 && (
            <p className="text-slate-500">No hay empleados registrados.</p>
          )}
        </div>
      </section>
    </div>
  );
}