import { useState, useEffect } from 'react';
import { empleadosService } from '../services/api';

export default function Expedientes() {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmp, setSelectedEmp] = useState<any>(null);

  useEffect(() => {
    empleadosService.listar().then(res => {
      setEmpleados(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const documentosRequeridos = [
    { nombre: 'Contrato firmado', tipo: 'Legal' },
    { nombre: 'DPI', tipo: 'Identificación' },
    { nombre: 'Antecedentes penales', tipo: 'Legal' },
    { nombre: 'Antecedentes policiales', tipo: 'Legal' },
    { nombre: 'Certificado de estudios', tipo: 'Académico' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>Expedientes</h2>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Gestión de documentos por empleado</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Lista empleados */}
        <div style={{
          background: 'rgba(13,23,48,0.8)', border: '1px solid rgba(59,130,246,0.1)',
          borderRadius: '16px', overflow: 'hidden'
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
            <h3 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 600, margin: 0 }}>Seleccionar Empleado</h3>
          </div>
          {loading ? (
            <p style={{ color: '#64748b', padding: '20px' }}>Cargando...</p>
          ) : (
            empleados.map((emp) => (
              <div key={emp.id} onClick={() => setSelectedEmp(emp)} style={{
                padding: '14px 20px', cursor: 'pointer',
                borderBottom: '1px solid rgba(59,130,246,0.05)',
                background: selectedEmp?.id === emp.id ? 'rgba(59,130,246,0.1)' : 'transparent',
                borderLeft: selectedEmp?.id === emp.id ? '3px solid #3b82f6' : '3px solid transparent',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '13px', fontWeight: 700, flexShrink: 0
                  }}>{emp.nombres?.charAt(0)}</div>
                  <div>
                    <div style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>{emp.nombres} {emp.apellidos}</div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>{emp.cargo}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Expediente del empleado */}
        <div>
          {!selectedEmp ? (
            <div style={{
              background: 'rgba(13,23,48,0.8)', border: '1px solid rgba(59,130,246,0.1)',
              borderRadius: '16px', padding: '60px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
              <p style={{ color: '#64748b', fontSize: '14px' }}>Selecciona un empleado para ver su expediente</p>
            </div>
          ) : (
            <div>
              {/* Info empleado */}
              <div style={{
                background: 'rgba(13,23,48,0.8)', border: '1px solid rgba(59,130,246,0.1)',
                borderRadius: '16px', padding: '24px', marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '22px', fontWeight: 700
                  }}>{selectedEmp.nombres?.charAt(0)}</div>
                  <div>
                    <h3 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>
                      {selectedEmp.nombres} {selectedEmp.apellidos}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>{selectedEmp.cargo} — {selectedEmp.departamento}</p>
                  </div>
                  <span style={{
                    marginLeft: 'auto', padding: '6px 16px', borderRadius: '20px',
                    background: 'rgba(34,197,94,0.1)', color: '#4ade80',
                    border: '1px solid rgba(34,197,94,0.2)', fontSize: '13px', fontWeight: 500
                  }}>{selectedEmp.estado}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {[
                    { label: 'DPI', value: selectedEmp.dpi },
                    { label: 'Email', value: selectedEmp.email },
                    { label: 'Salario', value: `Q${Number(selectedEmp.salario).toLocaleString()}` },
                    { label: 'Teléfono', value: selectedEmp.telefono },
                    { label: 'Dirección', value: selectedEmp.direccion },
                    { label: 'Fecha Nacimiento', value: selectedEmp.fechaNacimiento },
                  ].map((item, i) => (
                    <div key={i} style={{ background: 'rgba(59,130,246,0.05)', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>{item.label}</div>
                      <div style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documentos */}
              <div style={{
                background: 'rgba(13,23,48,0.8)', border: '1px solid rgba(59,130,246,0.1)',
                borderRadius: '16px', overflow: 'hidden'
              }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
                  <h3 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600, margin: 0 }}>Documentos Requeridos</h3>
                </div>
                {documentosRequeridos.map((doc, i) => (
                  <div key={i} style={{
                    padding: '14px 24px', borderBottom: '1px solid rgba(59,130,246,0.05)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>📄</span>
                      <div>
                        <div style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>{doc.nombre}</div>
                        <div style={{ color: '#64748b', fontSize: '11px' }}>{doc.tipo}</div>
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
                      background: 'rgba(34,197,94,0.1)', color: '#4ade80',
                      border: '1px solid rgba(34,197,94,0.2)'
                    }}>✓ Entregado</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}