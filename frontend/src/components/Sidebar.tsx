import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 rounded-lg mb-2 ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-200'
    }`;

  return (
    <aside className="w-64 bg-white shadow-lg p-5">
      <h1 className="text-2xl font-bold text-blue-700 mb-8">
        RRHH System
      </h1>

      <nav>
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/empleados" className={linkClass}>
          Empleados
        </NavLink>

        <NavLink to="/nomina" className={linkClass}>
          Nómina
        </NavLink>

        <NavLink to="/expedientes" className={linkClass}>
          Expedientes
        </NavLink>

        <NavLink to="/reportes" className={linkClass}>
          Reportes
        </NavLink>
      </nav>

      <button
        onClick={cerrarSesion}
        className="mt-8 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
      >
        Cerrar sesión
      </button>
    </aside>
  );
}