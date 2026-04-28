import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Empleados from './pages/Empleados';
import Nomina from './pages/Nomina';
import Reportes from './pages/Reportes';
import Expedientes from './pages/Expedientes';

type Page = 'dashboard' | 'empleados' | 'nomina' | 'reportes' | 'expedientes';

const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'empleados', label: 'Empleados' },
  { id: 'nomina', label: 'Nomina' },
  { id: 'expedientes', label: 'Expedientes' },
  { id: 'reportes', label: 'Reportes' },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [userEmail, setUserEmail] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (token) {
      setIsLoggedIn(true);
      setUserEmail(email || '');
    }
  }, []);

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setIsLoggedIn(false);
    setUserEmail('');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const getIcon = (id: string) => {
    if (id === 'dashboard') return '📊';
    if (id === 'empleados') return '👥';
    if (id === 'nomina') return '💰';
    if (id === 'expedientes') return '📁';
    if (id === 'reportes') return '📋';
    return '▪';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1e', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '260px' : '70px',
        background: 'linear-gradient(180deg, #0d1730 0%, #0a0f1e 100%)',
        borderRight: '1px solid rgba(59,130,246,0.15)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s ease',
        position: 'relative', zIndex: 10,
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 20px', borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', flexShrink: 0
            }}>⚡</div>
            {sidebarOpen && (
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>RRHH Sistema</div>
                <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>Gestion Empresarial</div>
              </div>
            )}
          </div>
        </div>

        {/* Toggle */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
          position: 'absolute', right: '-12px', top: '72px',
          width: '24px', height: '24px', borderRadius: '50%',
          background: '#1e40af', border: '2px solid #0a0f1e',
          color: '#fff', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: '10px'
        }}>
          {sidebarOpen ? '<' : '>'}
        </button>

        {/* Nav */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as Page)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: '12px', padding: '11px 12px', borderRadius: '10px',
                marginBottom: '4px', cursor: 'pointer', border: 'none',
                background: currentPage === item.id
                  ? 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(29,78,216,0.1))'
                  : 'transparent',
                color: currentPage === item.id ? '#60a5fa' : '#64748b',
                borderLeft: currentPage === item.id ? '3px solid #3b82f6' : '3px solid transparent',
                transition: 'all 0.2s ease', textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{getIcon(item.id)}</span>
              {sidebarOpen && (
                <span style={{ fontSize: '14px', fontWeight: currentPage === item.id ? 600 : 400 }}>
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        {sidebarOpen && (
          <div style={{ padding: '16px', borderTop: '1px solid rgba(59,130,246,0.1)' }}>
            <div style={{
              background: 'rgba(59,130,246,0.08)', borderRadius: '10px',
              padding: '12px', marginBottom: '8px'
            }}>
              <div style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '4px' }}>Usuario activo</div>
              <div style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>{userEmail}</div>
            </div>
            <button onClick={handleLogout} style={{
              width: '100%', padding: '10px', borderRadius: '8px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171', cursor: 'pointer', fontSize: '13px', fontWeight: 500
            }}>
              Cerrar sesion
            </button>
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{
          background: 'rgba(10,15,30,0.9)',
          borderBottom: '1px solid rgba(59,130,246,0.1)',
          padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h1 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 700, margin: 0 }}>
              {navItems.find(n => n.id === currentPage)?.label}
            </h1>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '2px 0 0' }}>
              Sistema de Gestion de RRHH y Nomina
            </p>
          </div>
          <div style={{
            padding: '6px 14px', borderRadius: '20px',
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
            color: '#4ade80', fontSize: '12px', fontWeight: 500
          }}>
            Sistema en linea
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'empleados' && <Empleados />}
          {currentPage === 'nomina' && <Nomina />}
          {currentPage === 'expedientes' && <Expedientes />}
          {currentPage === 'reportes' && <Reportes />}
        </main>
      </div>
    </div>
  );
}