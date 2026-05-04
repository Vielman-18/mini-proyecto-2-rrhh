import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

interface Empleado {
  id: number;
  nombres: string;
  apellidos: string;
  dpi: string;
  telefono: string;
  salario: number;
  cargo: string;
  departamento: string;
  estado: string;
}

export default function Empleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarEmpleados = async () => {
    try {
      setCargando(true);
      const res = await api.get('/empleados');
      setEmpleados(res.data);
    } catch (error) {
      toast.error('Error al cargar empleados');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  if (cargando) {
    return <p>Cargando empleados...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Empleados</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">DPI</th>
              <th className="p-3 text-left">Cargo</th>
              <th className="p-3 text-left">Departamento</th>
              <th className="p-3 text-left">Salario</th>
              <th className="p-3 text-left">Estado</th>
            </tr>
          </thead>

          <tbody>
            {empleados.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  No hay empleados registrados
                </td>
              </tr>
            ) : (
              empleados.map((empleado) => (
                <tr key={empleado.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {empleado.nombres} {empleado.apellidos}
                  </td>
                  <td className="p-3">{empleado.dpi}</td>
                  <td className="p-3">{empleado.cargo}</td>
                  <td className="p-3">{empleado.departamento}</td>
                  <td className="p-3">Q {empleado.salario}</td>
                  <td className="p-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {empleado.estado}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}