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
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-blue-500/20 bg-slate-900/80 p-8 shadow-2xl shadow-blue-950/30">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Sistema RRHH</h1>
          <p className="mt-2 text-sm text-slate-400">
            Inicia sesión con tu cuenta
          </p>
        </div>

        <form onSubmit={iniciarSesion} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Correo
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Contraseña
            </label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              placeholder="********"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Rol
            </label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            >
              <option value="rrhh">RRHH</option>
              <option value="admin">Admin</option>
              <option value="empleado">Empleado</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}