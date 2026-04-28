import { useState, useEffect } from 'react';
import { empleadosService } from '../services/api';

export default function Dashboard() {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    empleadosService.listar().then(res => {
      setEmpleados(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const activos = empleados.filter(e => e.estado === 'activo').length;
  const totalSalarios = empleados.reduce((acc, e) => acc + Number(e.salario), 0);
  const departamentos = [...new Set(empleados.map(e => e.departamento))].length;

  const stats = [
    { label: 'Total Empleados', value: loading ? '...' : empleados.length, icon: '👥', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Empleados Activos', value: loading ? '...' : activos, icon: '✅', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Departamentos', value: loading ? '...' : departamentos, icon: '🏢', color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
    { label: 'Masa Salarial', value: loading ? '...' : `Q${totalSalarios.toLocaleString()}`, icon: '💰', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  ];

  return (
    <div>
      {/* Welcome */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(29,78,216,0.08))',
        border: '1px solid rgba(59,130,246,0.2)', borderRadius: '16px',
        padding: '28px 32px', marginBottom: '32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <h2 style={{ color: '#f1f5f9', fontSize: '24px', fontWeight: 700, margin: '0 0 8px' }}>
            Bienvenido al Sistema RRHH 👋
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            Panel de control — {new Date().toLocaleDateString('es-GT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{
          background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: '12px', padding: '16px 24px', textAlign: 'center'
        }}>
          <div style={{ color: '#60a5fa', fontSize: '28px', fontWeight: 800 }}>{new Date().getFullYear()}</div>
          <div style={{ color: '#64748b', fontSize: '12px' }}>Año fiscal</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            background: 'rgba(13,23,48,0.8)', border: '1px solid rgba(59,130,246,0.1)',
            borderRadius: '16px', padding: '24px',
            transition: 'transform 0.2s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: stat.bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '20px'
              }}>{stat.icon}</div>
            </div>
            <div style={{ color: stat.color, fontSize: '32px', fontWeight: 800, marginBottom: '4px' }}>
              {stat.value}
            </div>
            <div style={{ color: '#64748b', fontSize: '13px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Employees table preview */}
      <div style={{
        background: 'rgba(13,23,48,0.8)', border: '1px solid rgba(59,130,246,0.1)',
        borderRadius: '16px', overflow: 'hidden', marginBottom: '24px'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(59,130,246,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 600, margin: 0 }}>Empleados Recientes</h3>
          <span style={{ color: '#64748b', fontSize: '13px' }}>{empleados.length} registros</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(59,130,246,0.05)' }}>
                {['Empleado', 'Cargo', 'Departamento', 'Salario', 'Estado'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', color: '#64748b', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {empleados.slice(0, 5).map((emp, i) => (
                <tr key={i} style={{ borderTop: '1px solid rgba(59,130,246,0.05)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '13px', fontWeight: 700, flexShrink: 0
                      }}>
                        {emp.nombres?.charAt(0)}
                      </div>
                      <div>
                        <div style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 500 }}>{emp.nombres} {emp.apellidos}</div>
                        <div style={{ color: '#64748b', fontSize: '12px' }}>{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '13px' }}>{emp.cargo}</td>
                  <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '13px' }}>{emp.departamento}</td>
                  <td style={{ padding: '14px 20px', color: '#60a5fa', fontSize: '13px', fontWeight: 600 }}>Q{Number(emp.salario).toLocaleString()}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                      background: 'rgba(34,197,94,0.1)', color: '#4ade80',
                      border: '1px solid rgba(34,197,94,0.2)'
                    }}>{emp.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{
          background: 'rgba(13,23,48,0.8)', border: '1px solid rgba(59,130,246,0.1)',
          borderRadius: '16px', padding: '24px'
        }}>
          <h3 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600, margin: '0 0 16px' }}>Estado del Sistema</h3>
          {[
            { label: 'Backend API', status: 'En línea', color: '#4ade80' },
            { label: 'Base de datos', status: 'Conectada', color: '#4ade80' },
            { label: 'Frontend', status: 'Activo', color: '#4ade80' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(59,130,246,0.05)' : 'none' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>{item.label}</span>
              <span style={{ color: item.color, fontSize: '13px', fontWeight: 500 }}>🟢 {item.status}</span>
            </div>
          ))}
        </div>
        <div style={{
          background: 'rgba(13,23,48,0.8)', border: '1px solid rgba(59,130,246,0.1)',
          borderRadius: '16px', padding: '24px'
        }}>
          <h3 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600, margin: '0 0 16px' }}>Información</h3>
          {[
            { label: 'Versión', value: '1.0.0' },
            { label: 'Tecnología', value: 'NestJS + React' },
            { label: 'Base de datos', value: 'PostgreSQL' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(59,130,246,0.05)' : 'none' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>{item.label}</span>
              <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}