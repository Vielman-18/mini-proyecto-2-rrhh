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
  const totalSalarios = empleados.reduce(
    (acc, e) => acc + Number(e.salario || 0),
    0,
  );

  const stats = [
    ['Total Empleados', loading ? '...' : empleados.length, '👥', 'text-cyan-300'],
    ['Activos', loading ? '...' : activos, '✅', 'text-emerald-300'],
    ['Suspendidos', loading ? '...' : suspendidos, '⚠️', 'text-amber-300'],
    ['Retirados', loading ? '...' : retirados, '🚪', 'text-red-300'],
    [
      'Masa Salarial',
      loading ? '...' : `Q${totalSalarios.toLocaleString()}`,
      '💰',
      'text-violet-300',
    ],
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] p-6 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.24),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.22),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(37,99,235,0.18),transparent_35%)]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:54px_54px]" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-[2.2rem] border border-cyan-400/20 bg-slate-950/80 p-8 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] border border-cyan-300/40 bg-cyan-400/10 shadow-xl shadow-cyan-500/20">
                <span className="text-3xl font-black text-cyan-300">
                  UMG
                </span>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.4em] text-cyan-300">
                  Universidad Mariano Gálvez
                </p>

                <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                  Dashboard RRHH
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                  Resumen general del sistema de recursos humanos.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-400/15 bg-white/[0.04] px-6 py-5">
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Estado del sistema
              </p>
              <p className="mt-2 text-lg font-black text-cyan-300">
                Operativo
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map(([label, value, icon, color]) => (
            <div
              key={label}
              className="group relative overflow-hidden rounded-[1.8rem] border border-cyan-400/15 bg-slate-950/80 p-6 shadow-xl shadow-black/30 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/30"
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl transition group-hover:bg-cyan-400/20" />

              <div className="relative z-10">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-3xl">
                  {icon}
                </div>

                <div className={`text-3xl font-black ${color}`}>
                  {value}
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-cyan-400/15 bg-slate-950/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="mb-6 border-b border-cyan-400/10 pb-4">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
                UMG RRHH
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                Empleados recientes
              </h2>
            </div>

            <div className="space-y-4">
              {empleados.slice(0, 5).map((emp) => (
                <div
                  key={emp.id}
                  className="group flex flex-col justify-between gap-4 rounded-3xl border border-cyan-400/10 bg-black/30 p-5 transition hover:-translate-y-0.5 hover:bg-cyan-400/[0.04] md:flex-row md:items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 font-black text-cyan-300">
                      {emp.nombres?.charAt(0)}
                      {emp.apellidos?.charAt(0)}
                    </div>

                    <div>
                      <p className="font-black text-white">
                        {emp.nombres} {emp.apellidos}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {emp.cargo || 'Sin cargo'} ·{' '}
                        {emp.departamento || 'Sin departamento'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full border px-4 py-2 text-xs font-bold ${
                      emp.estado === 'activo'
                        ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                        : emp.estado === 'suspendido'
                          ? 'border-amber-400/20 bg-amber-400/10 text-amber-300'
                          : 'border-red-400/20 bg-red-400/10 text-red-300'
                    }`}
                  >
                    {emp.estado}
                  </span>
                </div>
              ))}

              {!loading && empleados.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-700 bg-black/30 p-8 text-center text-slate-500">
                  No hay empleados registrados.
                </div>
              )}

              {loading && (
                <div className="rounded-3xl border border-dashed border-slate-700 bg-black/30 p-8 text-center text-slate-500">
                  Cargando empleados...
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-violet-400/15 bg-slate-950/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="mb-6 border-b border-violet-400/10 pb-4">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-300">
                Centro de control
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                Estado laboral
              </h2>
            </div>

            <div className="space-y-5">
              <Bar label="Activos" value={activos} total={empleados.length} color="bg-emerald-400" />
              <Bar label="Suspendidos" value={suspendidos} total={empleados.length} color="bg-amber-400" />
              <Bar label="Retirados" value={retirados} total={empleados.length} color="bg-red-400" />
            </div>

            <div className="mt-8 rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.04] p-5">
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Masa salarial total
              </p>
              <p className="mt-2 text-3xl font-black text-cyan-300">
                Q{totalSalarios.toLocaleString()}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Bar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const porcentaje = total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-bold text-slate-300">{label}</span>
        <span className="text-slate-500">{porcentaje}%</span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${porcentaje}%` }}
        />
      </div>
    </div>
  );
}