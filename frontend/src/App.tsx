import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Empleados from './pages/Empleados';
import Nomina from './pages/Nomina';
import Expedientes from './pages/Expedientes';
import Reportes from './pages/Reportes';
import Academico from './pages/Academico.tsx';

import Sidebar from './components/Sidebar';

import AdminHome from './pages/roles/AdminHome';
import EmpleadoHome from './pages/roles/EmpleadoHome';
import RRhhHome from './pages/roles/RRhhHome';

function RoleRedirect() {
  const role = localStorage.getItem('role')?.toLowerCase();

  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'rrhh') return <Navigate to="/rrhh" replace />;
  if (role === 'empleado') return <Navigate to="/empleado" replace />;

  return <Navigate to="/" replace />;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
function RRHHLayout() {
  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-x-hidden p-6">
        <Routes>
          <Route index element={<RRhhHome />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="empleados" element={<Empleados />} />
          <Route path="nomina" element={<Nomina />} />
          <Route path="expedientes" element={<Expedientes />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="academico" element={<Academico />} />

          <Route path="*" element={<Navigate to="/rrhh" replace />} />
        </Routes>
      </main>
    </div>
  );

}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <RoleRedirect />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminHome />
          </PrivateRoute>
        }
      />

      <Route
        path="/empleado"
        element={
          <PrivateRoute>
            <EmpleadoHome />
          </PrivateRoute>
        }
      />

      <Route
        path="/rrhh/*"
        element={
          <PrivateRoute>
            <RRHHLayout />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}