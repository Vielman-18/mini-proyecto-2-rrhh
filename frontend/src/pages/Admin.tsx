import { useState, useEffect } from 'react';
import { authService, departamentosService, puestosService } from '../services/api';

type Tab = 'usuarios' | 'departamentos' | 'puestos';

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(59,130,246,0.2)',
  color: '#f1f5f9',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box' as const,
};

function GestionUsuarios() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', role: 'empleado' });
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setMsg({ text: 'La contraseña debe tener al menos 6 caracteres.', ok: false });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      await authService.register(form.email, form.password, form.role);
      setMsg({ text: `Usuario ${form.email} creado correctamente.`, ok: true });
      setForm({ email: '', password: '', role: 'empleado' });
      setShowForm(false);
    } catch {
      setMsg({ text: 'Error al crear el usuario. El correo ya puede estar en uso.', ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>Gestión de Usuarios</h3>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Crea usuarios con rol admin o empleado</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setMsg(null); }} style={{
          padding: '10px 20px', borderRadius: '10px',
          background: showForm ? 'rgba(239,68,68,0.1)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          border: showForm ? '1px solid rgba(239,68,68,0.3)' : 'none',
          color: showForm ? '#f87171' : '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
        }}>
          {showForm ? '✕ Cancelar' : '+ Nuevo Usuario'}
        </button>
      </div>

      {msg && (
        <div style={{
          background: msg.ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${msg.ok ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
          borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
          color: msg.ok ? '#4ade80' : '#f87171', fontSize: '14px',
        }}>
          {msg.ok ? '✓' : '⚠️'} {msg.text}
        </div>
      )}

      {showForm && (
        <div style={{
          background: 'rgba(13,23,48,0.9)', border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: '16px', padding: '28px', marginBottom: '24px',
        }}>
          <h4 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600, margin: '0 0 20px' }}>Nuevo Usuario</h4>
          <form onSubmit={handleCrear}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Correo electrónico *</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="correo@empresa.com" style={inputStyle} />
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Contraseña * (mínimo 6 caracteres)</label>
                <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Rol *</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="empleado">Empleado</option>
                <option value="admin">Administrador</option>
                <option value="rrhh">RRHH</option>
              </select>
            </div>
            <button type="submit" disabled={loading} style={{
              padding: '11px 28px', borderRadius: '10px',
              background: loading ? 'rgba(34,197,94,0.4)' : 'linear-gradient(135deg, #22c55e, #16a34a)',
              border: 'none', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            }}>
              {loading ? 'Creando...' : '✓ Crear Usuario'}
            </button>
          </form>
        </div>
      )}

      <div style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: '12px', padding: '20px' }}>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          💡 El rol <strong style={{ color: '#60a5fa' }}>admin</strong> tiene acceso total,
          <strong style={{ color: '#60a5fa' }}> rrhh</strong> gestiona empleados y nómina,
          <strong style={{ color: '#60a5fa' }}> empleado</strong> tiene acceso limitado.
        </p>
      </div>
    </div>
  );
}

function GestionDepartamentos() {
  const [departamentos, setDepartamentos] = useState<{ id: number; nombre: string; descripcion?: string }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await departamentosService.listar();
      setDepartamentos(res.data);
    } catch { } finally { setLoading(false); }
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) { setMsg({ text: 'El nombre es requerido.', ok: false }); return; }
    try {
      await departamentosService.crear({ nombre: form.nombre.trim(), descripcion: form.descripcion.trim() });
      setMsg({ text: `Departamento "${form.nombre}" creado.`, ok: true });
      setForm({ nombre: '', descripcion: '' });
      setShowForm(false);
      cargar();
    } catch { setMsg({ text: 'Error al crear el departamento.', ok: false }); }
  };

  const handleEliminar = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;
    try {
      await departamentosService.eliminar(id);
      setMsg({ text: `Departamento "${nombre}" eliminado.`, ok: true });
      cargar();
    } catch { setMsg({ text: 'Error al eliminar.', ok: false }); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>Gestión de Departamentos</h3>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>{departamentos.length} departamentos registrados</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setMsg(null); }} style={{
          padding: '10px 20px', borderRadius: '10px',
          background: showForm ? 'rgba(239,68,68,0.1)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          border: showForm ? '1px solid rgba(239,68,68,0.3)' : 'none',
          color: showForm ? '#f87171' : '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
        }}>
          {showForm ? '✕ Cancelar' : '+ Nuevo Departamento'}
        </button>
      </div>

      {msg && (
        <div style={{
          background: msg.ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${msg.ok ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
          borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
          color: msg.ok ? '#4ade80' : '#f87171', fontSize: '14px',
        }}>
          {msg.ok ? '✓' : '⚠️'} {msg.text}
        </div>
      )}

      {showForm && (
        <div style={{ background: 'rgba(13,23,48,0.9)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h4 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600, margin: '0 0 20px' }}>Nuevo Departamento</h4>
          <form onSubmit={handleCrear}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Nombre *</label>
                <input type="text" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Recursos Humanos" style={inputStyle} />
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Descripción (opcional)</label>
                <input type="text" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripción breve" style={inputStyle} />
              </div>
            </div>
            <button type="submit" style={{ padding: '11px 28px', borderRadius: '10px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', border: 'none', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              ✓ Guardar Departamento
            </button>
          </form>
        </div>
      )}

      <div style={{ background: 'rgba(13,23,48,0.8)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(59,130,246,0.08)' }}>
              {['#', 'Nombre', 'Descripción', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Cargando...</td></tr>
            ) : departamentos.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No hay departamentos. ¡Crea el primero!</td></tr>
            ) : departamentos.map((dep) => (
              <tr key={dep.id} style={{ borderTop: '1px solid rgba(59,130,246,0.05)' }}>
                <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '13px' }}>#{dep.id}</td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🏢</div>
                    <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 500 }}>{dep.nombre}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '13px' }}>{dep.descripcion || '—'}</td>
                <td style={{ padding: '14px 20px' }}>
                  <button onClick={() => handleEliminar(dep.id, dep.nombre)} style={{ padding: '6px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GestionPuestos() {
  const [puestos, setPuestos] = useState<{ id: number; nombre: string; departamento: string; salarioBase?: number }[]>([]);
  const [departamentos, setDepartamentos] = useState<{ id: number; nombre: string }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', departamento: '', salarioBase: '' });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [filtro, setFiltro] = useState('');

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    setLoading(true);
    try {
      const [pRes, dRes] = await Promise.allSettled([puestosService.listar(), departamentosService.listar()]);
      if (pRes.status === 'fulfilled') setPuestos(pRes.value.data);
      if (dRes.status === 'fulfilled') setDepartamentos(dRes.value.data);
    } catch { } finally { setLoading(false); }
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.departamento.trim()) { setMsg({ text: 'Nombre y departamento son obligatorios.', ok: false }); return; }
    try {
      await puestosService.crear({ nombre: form.nombre.trim(), departamento: form.departamento.trim(), salarioBase: form.salarioBase ? Number(form.salarioBase) : undefined });
      setMsg({ text: `Puesto "${form.nombre}" creado.`, ok: true });
      setForm({ nombre: '', departamento: '', salarioBase: '' });
      setShowForm(false);
      cargar();
    } catch { setMsg({ text: 'Error al crear el puesto.', ok: false }); }
  };

  const handleEliminar = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;
    try {
      await puestosService.eliminar(id);
      setMsg({ text: `Puesto "${nombre}" eliminado.`, ok: true });
      cargar();
    } catch { setMsg({ text: 'Error al eliminar.', ok: false }); }
  };

  const filtered = puestos.filter(p => `${p.nombre} ${p.departamento}`.toLowerCase().includes(filtro.toLowerCase()));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>Gestión de Puestos</h3>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>{puestos.length} puestos registrados</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setMsg(null); }} style={{
          padding: '10px 20px', borderRadius: '10px',
          background: showForm ? 'rgba(239,68,68,0.1)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          border: showForm ? '1px solid rgba(239,68,68,0.3)' : 'none',
          color: showForm ? '#f87171' : '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
        }}>
          {showForm ? '✕ Cancelar' : '+ Nuevo Puesto'}
        </button>
      </div>

      {msg && (
        <div style={{
          background: msg.ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${msg.ok ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
          borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
          color: msg.ok ? '#4ade80' : '#f87171', fontSize: '14px',
        }}>
          {msg.ok ? '✓' : '⚠️'} {msg.text}
        </div>
      )}

      {showForm && (
        <div style={{ background: 'rgba(13,23,48,0.9)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h4 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600, margin: '0 0 20px' }}>Nuevo Puesto</h4>
          <form onSubmit={handleCrear}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Nombre del Puesto *</label>
                <input type="text" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Analista" style={inputStyle} />
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Departamento *</label>
                {departamentos.length > 0 ? (
                  <select required value={form.departamento} onChange={(e) => setForm({ ...form, departamento: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">Seleccionar...</option>
                    {departamentos.map(d => <option key={d.id} value={d.nombre}>{d.nombre}</option>)}
                  </select>
                ) : (
                  <input type="text" required value={form.departamento} onChange={(e) => setForm({ ...form, departamento: e.target.value })} placeholder="Ej: Tecnología" style={inputStyle} />
                )}
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Salario Base (Q) — opcional</label>
                <input type="number" min="0" value={form.salarioBase} onChange={(e) => setForm({ ...form, salarioBase: e.target.value })} placeholder="Ej: 5000" style={inputStyle} />
              </div>
            </div>
            <button type="submit" style={{ padding: '11px 28px', borderRadius: '10px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', border: 'none', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              ✓ Guardar Puesto
            </button>
          </form>
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <input type="text" placeholder="🔍 Buscar por puesto o departamento..." value={filtro} onChange={(e) => setFiltro(e.target.value)} style={{ ...inputStyle, padding: '12px 16px', fontSize: '14px' }} />
      </div>

      <div style={{ background: 'rgba(13,23,48,0.8)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(59,130,246,0.08)' }}>
              {['#', 'Puesto', 'Departamento', 'Salario Base', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Cargando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>{puestos.length === 0 ? 'No hay puestos. ¡Crea el primero!' : 'Sin resultados.'}</td></tr>
            ) : filtered.map((p) => (
              <tr key={p.id} style={{ borderTop: '1px solid rgba(59,130,246,0.05)' }}>
                <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '13px' }}>#{p.id}</td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>💼</div>
                    <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 500 }}>{p.nombre}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', background: 'rgba(168,85,247,0.1)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)' }}>{p.departamento}</span>
                </td>
                <td style={{ padding: '14px 20px', color: '#60a5fa', fontSize: '13px', fontWeight: 600 }}>{p.salarioBase ? `Q${p.salarioBase.toLocaleString()}` : '—'}</td>
                <td style={{ padding: '14px 20px' }}>
                  <button onClick={() => handleEliminar(p.id, p.nombre)} style={{ padding: '6px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Admin() {
  const [tab, setTab] = useState<Tab>('usuarios');

  const tabs = [
    { id: 'usuarios' as Tab, label: 'Usuarios', icon: '👤' },
    { id: 'departamentos' as Tab, label: 'Departamentos', icon: '🏢' },
    { id: 'puestos' as Tab, label: 'Puestos', icon: '💼' },
  ];

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(109,40,217,0.08))', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '16px', padding: '20px 28px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>⚙️</div>
        <div>
          <div style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Panel de Administración</div>
          <div style={{ color: '#94a3b8', fontSize: '13px' }}>Gestión de usuarios, departamentos y puestos</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: 'rgba(13,23,48,0.6)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: '12px', padding: '6px' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '10px 16px', borderRadius: '8px', border: 'none',
            background: tab === t.id ? 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(29,78,216,0.15))' : 'transparent',
            color: tab === t.id ? '#60a5fa' : '#64748b',
            cursor: 'pointer', fontSize: '14px', fontWeight: tab === t.id ? 600 : 400,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            borderLeft: tab === t.id ? '2px solid #3b82f6' : '2px solid transparent',
            transition: 'all 0.2s ease',
          }}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      <div style={{ background: 'rgba(13,23,48,0.6)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: '16px', padding: '28px' }}>
        {tab === 'usuarios' && <GestionUsuarios />}
        {tab === 'departamentos' && <GestionDepartamentos />}
        {tab === 'puestos' && <GestionPuestos />}
      </div>
    </div>
  );
}