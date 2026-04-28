import { useState, useEffect } from 'react';
import { empleadosService } from '../services/api';

export default function Reportes() {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    empleadosService.listar().then(res => {
      setEmpleados(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalSalarios = empleados.reduce((acc, e) => acc + Number(e.salario), 0);
  const porDepartamento = empleados.reduce((acc: any, e) => {
    acc[e.departamento] = (acc[e.departamento] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>Reportes del Sistema</h2>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Resumen general de la organización</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
        {[
          { label: 'Total Empleados', value: empleados.length, icon: '👥', color: '#3b82f6' },
          { label: 'Masa Salarial Total', value: `Q${totalSalarios.toLocaleString()}`, icon: '💰', color: '#22c55e' },
          { label: 'Departamentos', value: Object.keys(porDepartamento).length, icon: '🏢', color: '#a855f7' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'rgba(13,23,48,0.8)', border: '1px solid rgba(59,130,246,0.1)',
            borderRadius: '16px', padding: '24px'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>{stat.icon}</div>
            <div style={{ color: stat.color, fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>
              {loading ? '...' : stat.value}
            </div>
            <div style={{ color: '#64748b', fontSize: '13px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Por departamento */}
      <div style={{
        background: 'rgba(13,23,48,0.8)', border: '1px solid rgba(59,130,246,0.1)',
        borderRadius: '16px', padding: '24px', marginBottom: '24px'
      }}>
        <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 600, margin: '0 0 20px' }}>
          Empleados por Departamento
        </h3>
        {loading ? (
          <p style={{ color: '#64748b' }}>Cargando...</p>
        ) : (
          Object.entries(porDepartamento).map(([dept, count]: any, i) => (
            <div key={i} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>{dept}</span>
                <span style={{ color: '#60a5fa', fontSize: '13px', fontWeight: 600 }}>{count} empleados</span>
              </div>
              <div style={{ background: 'rgba(59,130,246,0.1)', borderRadius: '4px', height: '6px' }}>
                <div style={{
                  background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                  height: '100%', borderRadius: '4px',
                  width: `${(count / empleados.length) * 100}%`,
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Salarios por empleado */}
      <div style={{
        background: 'rgba(13,23,48,0.8)', border: '1px solid rgba(59,130,246,0.1)',
        borderRadius: '16px', overflow: 'hidden'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
          <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 600, margin: 0 }}>
            Reporte Salarial por Empleado
          </h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(59,130,246,0.08)' }}>
              {['Empleado', 'Cargo', 'Departamento', 'Salario', 'Estado'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp, i) => (
              <tr key={i} style={{ borderTop: '1px solid rgba(59,130,246,0.05)' }}>
                <td style={{ padding: '14px 20px', color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>{emp.nombres} {emp.apellidos}</td>
                <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '13px' }}>{emp.cargo}</td>
                <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '13px' }}>{emp.departamento}</td>
                <td style={{ padding: '14px 20px', color: '#60a5fa', fontSize: '13px', fontWeight: 600 }}>Q{Number(emp.salario).toLocaleString()}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
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
  );
}