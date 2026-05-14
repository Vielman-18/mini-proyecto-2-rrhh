import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminHome from './pages/roles/AdminHome';
import EmpleadoHome from './pages/roles/EmpleadoHome';
import RRhhHome from './pages/roles/RRhhHome';

function PrivateRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" />;
  if (!role || !allowedRoles.includes(role)) return <Navigate to="/login" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={
        <PrivateRoute allowedRoles={['admin']}>
          <AdminHome />
        </PrivateRoute>
      } />
      <Route path="/rrhh" element={
        <PrivateRoute allowedRoles={['rrhh']}>
          <RRhhHome />
        </PrivateRoute>
      } />
      <Route path="/empleado" element={
        <PrivateRoute allowedRoles={['empleado']}>
          <EmpleadoHome />
        </PrivateRoute>
      } />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}