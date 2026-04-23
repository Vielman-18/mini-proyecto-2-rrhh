import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Empleados from './pages/Empleados';
import Nomina from './pages/Nomina';

type Page = 'dashboard' | 'empleados' | 'nomina';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-lg font-bold">Sistema RRHH</h1>
          <p className="text-blue-300 text-sm">y Nómina</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {[
              { id: 'dashboard', label: '📊 Dashboard' },
              { id: 'empleados', label: '👥 Empleados' },
              { id: 'nomina', label: '💰 Nómina' },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id as Page)}
                  className={`w-full text-left px-4 py-2 rounded transition ${
                    currentPage === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-200 hover:bg-blue-700'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-blue-200 hover:bg-blue-700 rounded"
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-700">
            {currentPage === 'dashboard' && 'Dashboard'}
            {currentPage === 'empleados' && 'Gestión de Empleados'}
            {currentPage === 'nomina' && 'Gestión de Nómina'}
          </h2>
        </header>
        <main>
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'empleados' && <Empleados />}
          {currentPage === 'nomina' && <Nomina />}
        </main>
      </div>
    </div>
  );
}