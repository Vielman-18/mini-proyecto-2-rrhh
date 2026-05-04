import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

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
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', rol);
      localStorage.setItem('correo', correo);

      toast.success('Inicio de sesión correcto');

      navigate('/home');
    } catch (error) {
      toast.error('Credenciales incorrectas');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-700">
      <form
        onSubmit={iniciarSesion}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Sistema RRHH
        </h1>

        <label className="block mb-2 font-semibold">Correo</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-4"
          placeholder="admin@gmail.com"
          required
        />

        <label className="block mb-2 font-semibold">Contraseña</label>
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-4"
          placeholder="********"
          required
        />

        <label className="block mb-2 font-semibold">Rol</label>
        <select
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-6 bg-white"
          required
        >
          <option value="admin">Administrador</option>
          <option value="empleado">Empleado</option>
          <option value="rrhh">Recursos Humanos</option>
        </select>

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {cargando ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
}