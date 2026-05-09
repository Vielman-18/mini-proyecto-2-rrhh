import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('rrhh');
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setCargando(true);

      const res = await api.post('/auth/login', {
        correo,
        contrasena,
        rol,
      });

      const token = res.data.access_token || res.data.token;
      const rolUsuario = (res.data.rol || rol).toLowerCase();

      localStorage.setItem('token', token);
      localStorage.setItem('role', rolUsuario);
      localStorage.setItem('correo', correo);

      toast.success('Inicio de sesión correcto');

      navigate('/home');
    } catch {
      toast.error('Credenciales incorrectas o rol incorrecto');
    } finally {
      setCargando(false);
    }
  };

return (
  <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.25),transparent_28%),radial-gradient(circle_at_85%_80%,rgba(99,102,241,0.28),transparent_30%)]" />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.07)_1px,transparent_1px)] bg-[size:58px_58px]" />

    <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
      <div className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-[2.2rem] border border-cyan-400/20 bg-slate-950/75 shadow-2xl shadow-cyan-950/50 backdrop-blur-2xl lg:grid-cols-[1.15fr_0.85fr]">
        
        <section className="relative hidden min-h-[650px] overflow-hidden p-14 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,rgba(34,211,238,0.16),transparent_35%)]" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-300/40 bg-cyan-400/10 shadow-xl shadow-cyan-500/20">
                  <span className="text-3xl font-black text-cyan-300">UMG</span>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.45em] text-cyan-300">
                    Universidad Mariano Gálvez
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Sistema de Recursos Humanos
                  </p>
                </div>
              </div>

              <div className="mt-24 max-w-2xl">
                <h1 className="text-6xl font-black leading-none tracking-tight">
                  Bienvenido al
                  <span className="mt-3 block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                    Portal RRHH
                  </span>
                </h1>

                <p className="mt-8 max-w-lg text-base leading-8 text-slate-300">
                  Accede a tu cuenta para continuar con la gestión del sistema.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              <div className="rounded-3xl border border-cyan-400/15 bg-white/[0.04] p-5">
                <p className="text-2xl font-black text-cyan-300">RRHH</p>
                <p className="mt-2 text-xs text-slate-400">Gestión</p>
              </div>

              <div className="rounded-3xl border border-blue-400/15 bg-white/[0.04] p-5">
                <p className="text-2xl font-black text-blue-300">Admin</p>
                <p className="mt-2 text-xs text-slate-400">Control</p>
              </div>

              <div className="rounded-3xl border border-violet-400/15 bg-white/[0.04] p-5">
                <p className="text-2xl font-black text-violet-300">User</p>
                <p className="mt-2 text-xs text-slate-400">Acceso</p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative flex items-center justify-center p-8 sm:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-950 to-black" />

          <div className="relative w-full max-w-md">
            <div className="mb-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 shadow-lg shadow-cyan-500/20 lg:hidden">
                <span className="text-xl font-black text-cyan-300">UMG</span>
              </div>

              <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
                UMG RRHH
              </p>

              <h2 className="text-4xl font-black tracking-tight text-white">
                Iniciar sesión
              </h2>

              <p className="mt-4 text-sm text-slate-400">
                Ingresa tus datos para continuar.
              </p>
            </div>

            <form
              onSubmit={iniciarSesion}
              className="space-y-6 rounded-[2rem] border border-cyan-400/20 bg-slate-950/80 p-8 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Correo
                </label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700/80 bg-black/40 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:bg-slate-950"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700/80 bg-black/40 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:bg-slate-950"
                  placeholder="********"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Rol
                </label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700/80 bg-black/40 px-4 py-3.5 text-white outline-none transition focus:border-cyan-400 focus:bg-slate-950"
                >
                  <option value="rrhh">RRHH</option>
                  <option value="admin">Admin</option>
                  <option value="empleado">Empleado</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="group relative w-full overflow-hidden rounded-2xl border border-cyan-300/30 bg-cyan-400 px-5 py-4 font-black text-slate-950 shadow-xl shadow-cyan-500/25 transition hover:-translate-y-0.5 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition duration-700 group-hover:translate-x-full" />
                <span className="relative">
                  {cargando ? 'Ingresando...' : 'Iniciar sesión'}
                </span>
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              Universidad Mariano Gálvez de Guatemala
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
);
}