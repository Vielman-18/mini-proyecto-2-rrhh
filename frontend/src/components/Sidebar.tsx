import { NavLink, useNavigate } from 'react-router-dom';

const links = [
  { to: '/rrhh/dashboard', label: 'Dashboard', icon: '⌁' },
  { to: '/rrhh/empleados', label: 'Empleados', icon: '◈' },
  { to: '/rrhh/nomina', label: 'Nómina', icon: '◍' },
  { to: '/rrhh/expedientes', label: 'Expedientes', icon: '▣' },
  { to: '/rrhh/reportes', label: 'Reportes', icon: '▤' },
  { to: '/rrhh/academico', label: 'Académico', icon: '✦' },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <aside className="sticky top-0 flex min-h-screen w-72 flex-col overflow-hidden border-r border-cyan-400/15 bg-[#020617] p-5 text-white shadow-2xl shadow-cyan-950/30">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_80%_90%,rgba(139,92,246,0.18),transparent_35%)]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-8 rounded-[2rem] border border-cyan-400/20 bg-slate-950/80 p-5 shadow-xl shadow-cyan-950/30">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/40 bg-cyan-400/10 shadow-lg shadow-cyan-500/20">
              <span className="text-xl font-black text-cyan-300">
                UMG
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black text-white">
                RRHH
              </h2>
              <p className="text-xs text-slate-400">
                Panel administrativo
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] px-4 py-3">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Universidad
            </p>
            <p className="mt-1 text-sm font-bold text-cyan-300">
              Mariano Gálvez
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-bold transition ${
                  isActive
                    ? 'border-cyan-300/40 bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                    : 'border-cyan-400/10 bg-slate-950/60 text-slate-300 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300'
                }`
              }
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-current/20 bg-black/10 text-lg">
                {link.icon}
              </span>

              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 rounded-[1.7rem] border border-red-400/15 bg-red-500/5 p-4">
          <button
            onClick={cerrarSesion}
            className="w-full rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 font-bold text-red-300 transition hover:-translate-y-0.5 hover:bg-red-500/20"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  );
}