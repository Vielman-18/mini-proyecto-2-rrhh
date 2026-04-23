import { useState, useEffect } from 'react';
import { nominaService } from '../services/api';

export default function Nomina() {
  const [nominas, setNominas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('');

  useEffect(() => {
    cargarNominas();
  }, []);

  const cargarNominas = async () => {
    try {
      const res = await nominaService.listar();
      setNominas(res.data);
    } catch {
      console.error('Error cargando nóminas');
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await nominaService.crear(periodo);
      setPeriodo('');
      cargarNominas();
    } catch {
      alert('Error al crear nómina');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Nómina</h2>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-bold mb-4">Crear Nueva Nómina</h3>
        <form onSubmit={handleCrear} className="flex gap-4">
          <input
            type="text"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            placeholder="Ej: 2026-04"
            className="border rounded px-3 py-2 flex-1 focus:outline-none focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Crear Nómina
          </button>
        </form>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando nóminas...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Período</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Fecha Inicio</th>
                <th className="p-3 text-left">Fecha Fin</th>
                <th className="p-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {nominas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No hay nóminas registradas
                  </td>
                </tr>
              ) : (
                nominas.map((nom) => (
                  <tr key={nom.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{nom.id}</td>
                    <td className="p-3">{nom.periodo}</td>
                    <td className="p-3">{nom.tipo_periodo}</td>
                    <td className="p-3">{nom.fecha_inicio}</td>
                    <td className="p-3">{nom.fecha_fin}</td>
                    <td className="p-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                        {nom.estado}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}