import { useState } from 'react';
import { authService } from '../services/api';

interface Props {
  onLogin: (email: string) => void;
}

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.login(email, password);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('email', email);
      onLogin(email);
    } catch {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1730 50%, #0a1628 100%)',
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Background effects */}
      <div style={{
        position: 'absolute', top: '-200px', left: '-200px',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-200px', right: '-200px',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(29,78,216,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Left panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px',
        borderRight: '1px solid rgba(59,130,246,0.1)',
      }}>
        <div style={{ maxWidth: '480px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '20px', padding: '6px 16px', marginBottom: '40px'
          }}>
            <span style={{ color: '#60a5fa', fontSize: '13px', fontWeight: 500 }}>⚡ Sistema Empresarial</span>
          </div>

          <h1 style={{
            color: '#f1f5f9', fontSize: '52px', fontWeight: 800,
            lineHeight: 1.1, margin: '0 0 20px', letterSpacing: '-1px'
          }}>
            Gestión de<br />
            <span style={{ color: '#3b82f6' }}>RRHH</span> y Nómina
          </h1>

          <p style={{ color: '#64748b', fontSize: '17px', lineHeight: 1.6, margin: '0 0 48px' }}>
            Plataforma integral para la administración de recursos humanos, nómina y expedientes empresariales.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '👥', text: 'Gestión completa de empleados' },
              { icon: '💰', text: 'Procesamiento de nómina automatizado' },
              { icon: '📁', text: 'Expedientes digitales seguros' },
              { icon: '📊', text: 'Reportes y analíticas en tiempo real' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'rgba(59,130,246,0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0
                }}>{item.icon}</div>
                <span style={{ color: '#94a3b8', fontSize: '14px' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div style={{
        width: '480px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '40px'
      }}>
        <div style={{
          width: '100%', background: 'rgba(13,23,48,0.8)',
          border: '1px solid rgba(59,130,246,0.15)',
          borderRadius: '20px', padding: '40px',
          backdropFilter: 'blur(20px)'
        }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', marginBottom: '20px'
            }}>⚡</div>
            <h2 style={{ color: '#f1f5f9', fontSize: '24px', fontWeight: 700, margin: '0 0 8px' }}>
              Iniciar Sesión
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '10px', padding: '12px 16px', marginBottom: '24px',
              color: '#f87171', fontSize: '14px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
                Correo electrónico
              </label>
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@empresa.com"
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.2)',
                  color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
                Contraseña
              </label>
              <input
                type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.2)',
                  color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? 'rgba(59,130,246,0.5)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                border: 'none', borderRadius: '10px', color: '#fff',
                fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? '⏳ Iniciando sesión...' : '→ Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}