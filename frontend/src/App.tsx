import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Empleados from './pages/Empleados';
import Nomina from './pages/Nomina';
import Expedientes from './pages/Expedientes';
import Reportes from './pages/Reportes';
import Sidebar from './components/Sidebar';

import AdminHome from './pages/roles/AdminHome';
import EmpleadoHome from './pages/roles/EmpleadoHome';

function RRHHLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/nomina" element={<Nomina />} />
          <Route path="/expedientes" element={<Expedientes />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
}

function RoleRedirect() {
  const role = localStorage.getItem('role');

  if (role === 'admin') {
    return <Navigate to="/admin" />;
  }

  if (role === 'empleado') {
    return <Navigate to="/empleado" />;
  }

  if (role === 'rrhh') {
    return <Navigate to="/dashboard" />;
  }

  return <Navigate to="/" />;
}

export default function App() {
  const token = localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {!token ? (
        <Route path="*" element={<Navigate to="/" />} />
      ) : (
        <>
          <Route path="/home" element={<RoleRedirect />} />

          <Route path="/admin" element={<AdminHome />} />
          <Route path="/empleado" element={<EmpleadoHome />} />

          <Route path="/*" element={<RRHHLayout />} />
        </>
      )}
    </Routes>
  );
}