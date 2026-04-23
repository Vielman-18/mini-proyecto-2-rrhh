import { useState, useEffect } from 'react';
import { empleadosService } from '../services/api';

export default function Dashboard() {
  const [totalEmpleados, setTotalEmpleados] = useState(0);

  useEffect(() => {
    empleadosService.listar().then(res => {
      setTotalEmpleados(res.data.length);
    });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm">Total Empleados</h3>
          <p className="text-3xl font-bold text-blue-600">{totalEmpleados}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm">Empleados Activos</h3>
          <p className="text-3xl font-bold text-green-600">{totalEmpleados}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm">Sistema</h3>
          <p className="text-3xl font-bold text-purple-600">✅</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Información del Sistema</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Backend</span>
            <span className="text-green-600 font-medium">🟢 En línea</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Base de datos</span>
            <span className="text-green-600 font-medium">🟢 Conectada</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">API</span>
            <span className="text-blue-600 font-medium">rrhh-nomina-backend.onrender.com</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Versión</span>
            <span className="font-medium">1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}