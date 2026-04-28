import { useState, useEffect } from 'react';
import { nominaService, empleadosService } from '../services/api';

export default function Nomina() {
  const [nominas, setNominas] = useState<any[]>([]);
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const empRes = await empleadosService.listar();
      setEmpleados(empRes.data);
    } catch (e) {
      console.error('Error empleados:', e);
    }
    try {
      const nomRes = await nominaService.listar();
      setNominas(nomRes.data);
    } catch (e) {
      console.error('Error nominas:', e);
    }
    setLoading(false);
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await nominaService.crear(periodo);
      setPeriodo('');
      setShowForm(false);
      const res = await nominaService.listar();
      setNominas(res.data);
    } catch { alert('Error al crear nomina'); }
  };

  const totalSalarios = empleados.reduce((acc, e) => acc + Number(e.salario), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>Gestion de Nomina</h2>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Administracion de periodos de nomina</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '10px 20px', borderRadius: '10px',
          background: showForm ? 'rgba(239,68,68,0.1)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          border: showForm ? '1px solid rgba(239,68,68,0.3)' : 'none',
          color: showForm ? '#f87171' : '#fff',
          cursor: 'pointer', fontSize: '14px', fontWeight: 600
        }}>
          {showForm ? 'X Cancelar' : '+ Nueva Nomina'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        {[
          { label: 'Total Empleados', value: empleados.length, icon: '👥', color: '#3b82f6' },
          { label: 'Masa Salarial', value: `Q${totalSalarios.toLocaleString()}`, icon: '💰', color: '#22c55e' },
          { label: 'Periodos Registrados', value: nominas.length, icon: '📅', color: '#a855f7' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'rgba(13,23,48,0.8)', border: '1px solid rgba(59,130,246,0.1)',
            borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px'
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'rgba(59,130,246,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0
            }}>{stat.icon}</div>
            <div>
              <div style={{ color: stat.color, fontSize: '24px', fontWeight: 800 }}>{loading ? '...' : stat.value}</div>
              <div style={{ color: '#64748b', fontSize: '12px' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{
          background: 'rgba(13,23,48,0.9)', border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: '16px', padding: '28px', marginBottom: '24px'
        }}>
          <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 600, margin: '0 0 20px' }}>Crear Nuevo Periodo de Nomina</h3>
          <form onSubmit={handleCrear} style={{ display: 'flex', gap: '12px' }}>
            <input type="text" value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              placeholder="Ej: 2026-04"
              required
              style={{
                flex: 1, padding: '12px 16px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.2)',
                color: '#f1f5f9', fontSize: '14px', outline: 'none'
              }}
            />
            <button type="submit" style={{
              padding: '12px 28px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              border: 'none', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
            }}>Crear Nomina</button>
          </form>
        </div>
      )}

      <div style={{
        background: 'rgba(13,23,48,0.8)', border: '1px solid rgba(59,130,246,0.1)',
        borderRadius: '16px', overflow: 'hidden', marginBottom: '24px'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
          <h3 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600, margin: 0 }}>Periodos de Nomina</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(59,130,246,0.08)' }}>
              {['ID', 'Periodo', 'Tipo', 'Fecha Inicio', 'Fecha Fin', 'Estado'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Cargando...</td></tr>
            ) : nominas.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No hay periodos registrados</td></tr>
            ) : nominas.map((nom) => (
              <tr key={nom.id} style={{ borderTop: '1px solid rgba(59,130,246,0.05)' }}>
                <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '13px' }}>#{nom.id}</td>
                <td style={{ padding: '14px 20px', color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>{nom.periodo}</td>
                <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '13px' }}>{nom.tipo_periodo}</td>
                <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '13px' }}>{nom.fecha_inicio?.split('T')[0]}</td>
                <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '13px' }}>{nom.fecha_fin?.split('T')[0]}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
                    background: 'rgba(34,197,94,0.1)', color: '#4ade80',
                    border: '1px solid rgba(34,197,94,0.2)'
                  }}>{nom.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        background: 'rgba(13,23,48,0.8)', border: '1px solid rgba(59,130,246,0.1)',
        borderRadius: '16px', overflow: 'hidden'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
          <h3 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600, margin: 0 }}>Detalle Salarial de Empleados</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(59,130,246,0.08)' }}>
              {['Empleado', 'Cargo', 'Salario Base', 'IGSS (4.83%)', 'Salario Neto'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {empleados.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Cargando empleados...</td></tr>
            ) : empleados.map((emp, i) => {
              const igss = Number(emp.salario) * 0.0483;
              const neto = Number(emp.salario) - igss;
              return (
                <tr key={i} style={{ borderTop: '1px solid rgba(59,130,246,0.05)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '12px', fontWeight: 700
                      }}>{emp.nombres?.charAt(0)}</div>
                      <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>{emp.nombres} {emp.apellidos}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '13px' }}>{emp.cargo}</td>
                  <td style={{ padding: '14px 20px', color: '#60a5fa', fontSize: '13px', fontWeight: 600 }}>Q{Number(emp.salario).toLocaleString()}</td>
                  <td style={{ padding: '14px 20px', color: '#f87171', fontSize: '13px' }}>-Q{igss.toFixed(2)}</td>
                  <td style={{ padding: '14px 20px', color: '#4ade80', fontSize: '13px', fontWeight: 600 }}>Q{neto.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}