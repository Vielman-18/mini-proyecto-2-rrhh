import { useState, useEffect } from 'react';
import { empleadosService } from '../services/api';

export default function Empleados() {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombres: '', apellidos: '', dpi: '', fechaNacimiento: '',
    direccion: '', telefono: '', email: '', salario: '',
    cargo: '', departamento: ''
  });

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const res = await empleadosService.listar();
      setEmpleados(res.data);
    } catch {
      console.error('Error cargando empleados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await empleadosService.crear({ ...form, salario: Number(form.salario) });
      setShowForm(false);
      setForm({ nombres: '', apellidos: '', dpi: '', fechaNacimiento: '', direccion: '', telefono: '', email: '', salario: '', cargo: '', departamento: '' });
      cargarEmpleados();
    } catch {
      alert('Error al crear empleado');
    }
  };

  const handleEliminar = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
      try {
        await empleadosService.eliminar(id);
        cargarEmpleados();
      } catch {
        alert('Error al eliminar empleado');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Empleados</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Empleado'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-bold mb-4">Nuevo Empleado</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {[
              { label: 'Nombres', key: 'nombres' },
              { label: 'Apellidos', key: 'apellidos' },
              { label: 'DPI', key: 'dpi' },
              { label: 'Fecha Nacimiento', key: 'fechaNacimiento', type: 'date' },
              { label: 'Dirección', key: 'direccion' },
              { label: 'Teléfono', key: 'telefono' },
              { label: 'Email', key: 'email', type: 'email' },
              { label: 'Salario', key: 'salario', type: 'number' },
              { label: 'Cargo', key: 'cargo' },
              { label: 'Departamento', key: 'departamento' },
            ].map(({ label, key, type = 'text' }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            ))}
            <div className="col-span-2">
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                Guardar Empleado
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Cargando empleados...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Cargo</th>
                <th className="p-3 text-left">Departamento</th>
                <th className="p-3 text-left">Salario</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((emp) => (
                <tr key={emp.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{emp.id}</td>
                  <td className="p-3">{emp.nombres} {emp.apellidos}</td>
                  <td className="p-3">{emp.cargo}</td>
                  <td className="p-3">{emp.departamento}</td>
                  <td className="p-3">Q{emp.salario}</td>
                  <td className="p-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                      {emp.estado}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleEliminar(emp.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}