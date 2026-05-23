import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function Dashboard() {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/empleados')
      .then((res) => {
        setEmpleados(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  const activos = empleados.filter((e) => e.estado === 'activo').length;
  const totalSalarios = empleados.reduce((acc, e) => acc + Number(e.salario || 0), 0);
  const departamentos = [...new Set(empleados.map((e) => e.departamento))].length;

  const stats = [
    {
      label: 'Total Empleados',
      value: loading ? '...' : empleados.length,
      icon: '👥',
      text: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      label: 'Empleados Activos',
      value: loading ? '...' : activos,
      icon: '✅',
      text: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
    {
      label: 'Departamentos',
      value: loading ? '...' : departamentos,
      icon: '🏢',
      text: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      label: 'Masa Salarial',
      value: loading ? '...' : `Q${totalSalarios.toLocaleString()}`,
      icon: '💰',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-6 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/15 to-blue-900/10 p-7 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-bold text-slate-100">
            Bienvenido al Sistema RRHH 👋
          </h2>
          <p className="text-sm text-slate-400">
            Panel de control —{' '}
            {new Date().toLocaleDateString('es-GT', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="w-fit rounded-xl border border-blue-500/20 bg-blue-500/10 px-6 py-4 text-center">
          <div className="text-3xl font-extrabold text-blue-400">
            {new Date().getFullYear()}
          </div>
          <div className="text-xs text-slate-400">Año fiscal</div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl border border-blue-500/10 bg-slate-950/80 p-6 shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:border-blue-500/30"
          >
            <div
              className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl border ${stat.bg} ${stat.border} text-xl`}
            >
              {stat.icon}
            </div>

            <div className={`mb-1 text-3xl font-extrabold ${stat.text}`}>
              {stat.value}
            </div>

            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-blue-500/10 bg-slate-950/80 shadow-lg shadow-black/10">
        <div className="flex items-center justify-between border-b border-blue-500/10 px-6 py-5">
          <h3 className="text-base font-semibold text-slate-100">
            Empleados Recientes
          </h3>
          <span className="text-sm text-slate-500">
            {empleados.length} registros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-500/5">
                {['Empleado', 'Cargo', 'Departamento', 'Salario', 'Estado'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {empleados.slice(0, 5).map((emp, i) => (
                <tr
                  key={i}
                  className="border-t border-blue-500/5 transition hover:bg-blue-500/5"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white">
                        {emp.nombres?.charAt(0)}
                      </div>

                      <div>
                        <div className="text-sm font-medium text-slate-200">
                          {emp.nombres} {emp.apellidos}
                        </div>
                        <div className="text-xs text-slate-500">
                          {emp.email || emp.correo || 'Sin correo'}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-400">
                    {emp.cargo}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-400">
                    {emp.departamento}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-blue-400">
                    Q{Number(emp.salario || 0).toLocaleString()}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${
                        emp.estado === 'activo'
                          ? 'border-green-500/20 bg-green-500/10 text-green-400'
                          : 'border-red-500/20 bg-red-500/10 text-red-400'
                      }`}
                    >
                      {emp.estado}
                    </span>
                  </td>
                </tr>
              ))}

              {!loading && empleados.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-sm text-slate-500"
                  >
                    No hay empleados registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-blue-500/10 bg-slate-950/80 p-6 shadow-lg shadow-black/10">
          <h3 className="mb-4 text-base font-semibold text-slate-100">
            Estado del Sistema
          </h3>

          {[
            { label: 'Backend API', status: 'En línea' },
            { label: 'Base de datos', status: 'Conectada' },
            { label: 'Frontend', status: 'Activo' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex justify-between border-b border-blue-500/5 py-3 last:border-b-0"
            >
              <span className="text-sm text-slate-400">{item.label}</span>
              <span className="text-sm font-medium text-green-400">
                🟢 {item.status}
              </span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-blue-500/10 bg-slate-950/80 p-6 shadow-lg shadow-black/10">
          <h3 className="mb-4 text-base font-semibold text-slate-100">
            Información
          </h3>

          {[
            { label: 'Versión', value: '1.0.0' },
            { label: 'Tecnología', value: 'NestJS + React' },
            { label: 'Base de datos', value: 'PostgreSQL' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex justify-between border-b border-blue-500/5 py-3 last:border-b-0"
            >
              <span className="text-sm text-slate-400">{item.label}</span>
              <span className="text-sm font-medium text-slate-200">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}