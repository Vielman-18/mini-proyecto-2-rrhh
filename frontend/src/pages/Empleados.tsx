import { useState, useEffect } from 'react';
import { empleadosService } from '../services/api';

export default function Empleados() {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    nombres: '', apellidos: '', dpi: '', fechaNacimiento: '',
    direccion: '', telefono: '', email: '', salario: '',
    cargo: '', departamento: ''
  });

  useEffect(() => { cargarEmpleados(); }, []);

  const cargarEmpleados = async () => {
    try {
      const res = await empleadosService.listar();
      setEmpleados(res.data);
    } catch { console.error('Error'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await empleadosService.crear({ ...form, salario: Number(form.salario) });
      setShowForm(false);
      setForm({ nombres: '', apellidos: '', dpi: '', fechaNacimiento: '', direccion: '', telefono: '', email: '', salario: '', cargo: '', departamento: '' });
      cargarEmpleados();
    } catch { alert('Error al crear empleado'); }
  };

  const handleEliminar = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
      try {
        await empleadosService.eliminar(id);
        cargarEmpleados();
      } catch { alert('Error al eliminar'); }
    }
  };

  const filtered = empleados.filter(e =>
    `${e.nombres} ${e.apellidos} ${e.cargo} ${e.departamento}`.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.2)',
    color: '#f1f5f9', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>Gestión de Empleados</h2>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>{empleados.length} empleados registrados</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '10px 20px', borderRadius: '10px',
          background: showForm ? 'rgba(239,68,68,0.1)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          border: showForm ? '1px solid rgba(239,68,68,0.3)' : 'none',
          color: showForm ? '#f87171' : '#fff',
          cursor: 'pointer', fontSize: '14px', fontWeight: 600
        }}>
          {showForm ? '✕ Cancelar' : '+ Nuevo Empleado'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{
          background: 'rgba(13,23,48,0.9)', border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: '16px', padding: '28px', marginBottom: '24px'
        }}>
          <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 600, margin: '0 0 20px' }}>Nuevo Empleado</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              {[
                { label: 'Nombres', key: 'nombres', type: 'text' },
                { label: 'Apellidos', key: 'apellidos', type: 'text' },
                { label: 'DPI', key: 'dpi', type: 'text' },
                { label: 'Fecha de Nacimiento', key: 'fechaNacimiento', type: 'date' },
                { label: 'Dirección', key: 'direccion', type: 'text' },
                { label: 'Teléfono', key: 'telefono', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Salario (Q)', key: 'salario', type: 'number' },
                { label: 'Cargo', key: 'cargo', type: 'text' },
                { label: 'Departamento', key: 'departamento', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>{label}</label>
                  <input type={type} value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    style={inputStyle} required />
                </div>
              ))}
            </div>
            <button type="submit" style={{
              padding: '12px 28px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              border: 'none', color: '#fff', fontSize: '14px',
              fontWeight: 600, cursor: 'pointer'
            }}>
              ✓ Guardar Empleado
            </button>
          </form>
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text" placeholder="🔍 Buscar por nombre, cargo o departamento..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, padding: '12px 16px', fontSize: '14px' }}
        />
      </div>

      {/* Table */}
      <div style={{
        background: 'rgba(13,23,48,0.8)', border: '1px solid rgba(59,130,246,0.1)',
        borderRadius: '16px', overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(59,130,246,0.08)' }}>
              {['Empleado', 'DPI', 'Cargo', 'Departamento', 'Salario', 'Estado', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Cargando empleados...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No se encontraron empleados</td></tr>
            ) : filtered.map((emp) => (
              <tr key={emp.id} style={{ borderTop: '1px solid rgba(59,130,246,0.05)' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '14px', fontWeight: 700, flexShrink: 0
                    }}>{emp.nombres?.charAt(0)}</div>
                    <div>
                      <div style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 500 }}>{emp.nombres} {emp.apellidos}</div>
                      <div style={{ color: '#64748b', fontSize: '12px' }}>{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '13px' }}>{emp.dpi}</td>
                <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '13px' }}>{emp.cargo}</td>
                <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '13px' }}>{emp.departamento}</td>
                <td style={{ padding: '14px 20px', color: '#60a5fa', fontSize: '13px', fontWeight: 600 }}>Q{Number(emp.salario).toLocaleString()}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                    background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)'
                  }}>{emp.estado}</span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <button onClick={() => handleEliminar(emp.id)} style={{
                    padding: '6px 14px', borderRadius: '8px',
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                    color: '#f87171', cursor: 'pointer', fontSize: '12px', fontWeight: 500
                  }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}