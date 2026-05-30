import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

type Rol = 'admin' | 'rrhh' | 'empleado';
type Vista = 'accesos' | 'departamentos' | 'puestos';

type EmpleadoBackend = {
  id: number;
  nombres: string;
  apellidos: string;
  dpi: string;
  email: string | null;
  cargo: string | null;
  departamento: string | null;
  usuario_id?: number | null;
};

type Departamento = { id: number; nombre: string; descripcion: string };
type Puesto = { id: number; nombre: string; departamento_id: number; salario_base: string };

const roles: { value: Rol; label: string; color: string }[] = [
  { value: 'empleado', label: 'Empleado', color: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300' },
  { value: 'rrhh', label: 'RRHH', color: 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300' },
  { value: 'admin', label: 'Admin', color: 'border-violet-400/40 bg-violet-400/10 text-violet-300' },
];

export default function AdminHome() {
  const navigate = useNavigate();
  const [vista, setVista] = useState<Vista>('accesos');

  const [empleados, setEmpleados] = useState<EmpleadoBackend[]>([]);
  const [loading, setLoading] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<EmpleadoBackend | null>(null);
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState<Rol>('empleado');
  const [busqueda, setBusqueda] = useState('');

  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [formDepto, setFormDepto] = useState({ nombre: '', descripcion: '' });
  const [showFormDepto, setShowFormDepto] = useState(false);

  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [formPuesto, setFormPuesto] = useState({ nombre: '', departamento_id: '', salario_base: '' });
  const [showFormPuesto, setShowFormPuesto] = useState(false);

  const correoAdmin = localStorage.getItem('correo') || 'admin@umg.edu.gt';

  const cargarEmpleados = async () => {
    try {
      setLoading(true);
      const res = await api.get('/empleados');
      setEmpleados(res.data);
    } catch {
      toast.error('Error al cargar empleados');
    } finally {
      setLoading(false);
    }
  };

  const cargarDepartamentos = async () => {
    try {
      const res = await api.get('/departamentos');
      setDepartamentos(res.data);
    } catch {
      toast.error('Error al cargar departamentos');
    }
  };

  const cargarPuestos = async () => {
    try {
      const res = await api.get('/puestos');
      setPuestos(res.data);
    } catch {
      toast.error('Error al cargar puestos');
    }
  };

  useEffect(() => {
    cargarEmpleados();
    cargarDepartamentos();
    cargarPuestos();
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('rol');
    localStorage.removeItem('correo');
    localStorage.removeItem('userId');
    toast.success('Sesión cerrada');
    navigate('/login');
  };

  const abrirCrearAcceso = (empleado: EmpleadoBackend) => {
    setEmpleadoSeleccionado(empleado);
    setCorreo(empleado.email || '');
    setContrasena('');
    setRol('empleado');
  };

  const cerrarPanel = () => {
    setEmpleadoSeleccionado(null);
    setCorreo('');
    setContrasena('');
    setRol('empleado');
  };

  const crearAcceso = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!empleadoSeleccionado) return;
    if (!correo.trim()) { toast.error('El correo es obligatorio'); return; }
    if (contrasena.length < 6) { toast.error('La contraseña debe tener mínimo 6 caracteres'); return; }
    try {
      const nombreCompleto = `${empleadoSeleccionado.nombres} ${empleadoSeleccionado.apellidos}`;
      const res = await api.post('/auth/register', { nombre: nombreCompleto, correo: correo.trim(), contrasena, rol });
      await api.post(`/auth/vincular-usuario/${empleadoSeleccionado.id}`, { usuarioId: res.data.userId, correo: correo.trim() });
      toast.success('Acceso creado correctamente');
      cerrarPanel();
      cargarEmpleados();
    } catch (error: any) {
      toast.error(error.response?.data?.message?.[0] || error.response?.data?.message || 'Error al crear acceso');
    }
  };

  const retirarAcceso = async (empleado: EmpleadoBackend) => {
    if (!empleado.usuario_id) { toast.error('Este empleado no tiene acceso activo'); return; }
    if (!confirm(`¿Deseas retirar el acceso de ${empleado.nombres} ${empleado.apellidos}?`)) return;
    try {
      await api.delete(`/auth/retirar-acceso/${empleado.id}`);
      toast.success('Acceso retirado correctamente');
      cargarEmpleados();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al retirar acceso');
    }
  };

  const crearDepartamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDepto.nombre.trim()) { toast.error('El nombre es obligatorio'); return; }
    try {
      const usuarioId = parseInt(localStorage.getItem('userId') || '1', 10);
      await api.post('/departamentos', {
        nombre: formDepto.nombre.trim(),
        descripcion: formDepto.descripcion.trim(),
        creado_por: usuarioId,
      });
      toast.success(`Departamento "${formDepto.nombre}" creado`);
      setFormDepto({ nombre: '', descripcion: '' });
      setShowFormDepto(false);
      cargarDepartamentos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear departamento');
    }
  };

  const eliminarDepartamento = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar el departamento "${nombre}"?`)) return;
    try {
      await api.delete(`/departamentos/${id}`);
      toast.success(`Departamento "${nombre}" eliminado`);
      cargarDepartamentos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar departamento');
    }
  };

  const crearPuesto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPuesto.nombre.trim() || !formPuesto.departamento_id) { toast.error('Nombre y departamento son obligatorios'); return; }
    try {
      const usuarioId = parseInt(localStorage.getItem('userId') || '1', 10);
      await api.post('/puestos', {
        nombre: formPuesto.nombre.trim(),
        departamento_id: Number(formPuesto.departamento_id),
        salario_base: formPuesto.salario_base ? Number(formPuesto.salario_base) : undefined,
        creado_por: usuarioId,
      });
      toast.success(`Puesto "${formPuesto.nombre}" creado`);
      setFormPuesto({ nombre: '', departamento_id: '', salario_base: '' });
      setShowFormPuesto(false);
      cargarPuestos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear puesto');
    }
  };

  const eliminarPuesto = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar el puesto "${nombre}"?`)) return;
    try {
      await api.delete(`/puestos/${id}`);
      toast.success(`Puesto "${nombre}" eliminado`);
      cargarPuestos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar puesto');
    }
  };

  const empleadosFiltrados = empleados.filter((emp) => {
    const texto = `${emp.nombres} ${emp.apellidos} ${emp.dpi} ${emp.email || ''}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  const totalEmpleados = empleados.length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] px-5 py-6 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.20),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(37,99,235,0.16),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:52px_52px]" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-7">

        <section className="relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-slate-950/80 p-7 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] border border-cyan-300/40 bg-cyan-400/10 shadow-xl shadow-cyan-500/20">
                <span className="text-3xl font-black text-cyan-300">UMG</span>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.4em] text-cyan-300">Universidad Mariano Gálvez</p>
                <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Panel de administración</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Gestión de accesos, departamentos y puestos.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-3xl border border-cyan-400/15 bg-white/[0.04] px-5 py-4">
                <p className="text-xs uppercase tracking-widest text-slate-500">Administrador</p>
                <p className="mt-1 max-w-[260px] truncate text-sm font-bold text-cyan-300">{correoAdmin}</p>
              </div>
              <button type="button" onClick={cerrarSesion} className="rounded-2xl border border-red-400/30 bg-red-500/10 px-6 py-4 font-bold text-red-300 transition hover:-translate-y-0.5 hover:bg-red-500/20">
                Cerrar sesión
              </button>
            </div>
          </div>
        </section>

        <div className="flex gap-2 rounded-2xl border border-cyan-400/10 bg-slate-950/60 p-2">
          {([
            { id: 'accesos', label: '👤 Accesos' },
            { id: 'departamentos', label: '🏢 Departamentos' },
            { id: 'puestos', label: '💼 Puestos' },
          ] as { id: Vista; label: string }[]).map(t => (
            <button key={t.id} type="button" onClick={() => setVista(t.id)}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition ${vista === t.id ? 'bg-cyan-400/15 text-cyan-300 border border-cyan-400/30' : 'text-slate-500 hover:text-slate-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-[1.7rem] border border-cyan-400/15 bg-slate-950/75 p-6 shadow-xl shadow-black/20 backdrop-blur-xl">
            <p className="text-sm text-slate-400">Empleados</p>
            <p className="mt-3 text-4xl font-black text-white">{totalEmpleados}</p>
            <p className="mt-2 text-xs text-cyan-300">Registrados</p>
          </div>
          <div className="rounded-[1.7rem] border border-emerald-400/15 bg-slate-950/75 p-6 shadow-xl shadow-black/20 backdrop-blur-xl">
            <p className="text-sm text-slate-400">Departamentos</p>
            <p className="mt-3 text-4xl font-black text-emerald-300">{departamentos.length}</p>
            <p className="mt-2 text-xs text-emerald-300">Registrados</p>
          </div>
          <div className="rounded-[1.7rem] border border-violet-400/15 bg-slate-950/75 p-6 shadow-xl shadow-black/20 backdrop-blur-xl">
            <p className="text-sm text-slate-400">Puestos</p>
            <p className="mt-3 text-4xl font-black text-violet-300">{puestos.length}</p>
            <p className="mt-2 text-xs text-violet-300">Registrados</p>
          </div>
        </section>

        {vista === 'accesos' && (
          <div className="grid gap-7 xl:grid-cols-[1.45fr_0.75fr]">
            <section className="overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-slate-950/80 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="flex flex-col gap-5 border-b border-cyan-400/10 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">Directorio UMG</p>
                  <h2 className="mt-2 text-2xl font-black">Empleados registrados</h2>
                  <p className="mt-1 text-sm text-slate-500">{loading ? 'Cargando...' : `${empleadosFiltrados.length} empleados encontrados`}</p>
                </div>
                <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar nombre, DPI o correo..."
                  className="w-full rounded-2xl border border-cyan-400/15 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400 lg:w-96" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-cyan-400/[0.04]">
                      {['Empleado', 'DPI', 'Cargo', 'Departamento', 'Correo', 'Acceso', 'Acción'].map(h => (
                        <th key={h} className="px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {empleadosFiltrados.map(emp => (
                      <tr key={emp.id} className="border-t border-cyan-400/5 transition hover:bg-cyan-400/[0.04]">
                        <td className="px-5 py-5"><p className="font-bold text-white">{emp.nombres} {emp.apellidos}</p><p className="text-xs text-slate-500">ID #{emp.id}</p></td>
                        <td className="px-5 py-5 text-sm text-slate-400">{emp.dpi}</td>
                        <td className="px-5 py-5 text-sm text-slate-400">{emp.cargo || 'Sin cargo'}</td>
                        <td className="px-5 py-5 text-sm text-slate-400">{emp.departamento || 'Sin departamento'}</td>
                        <td className="px-5 py-5 text-sm">{emp.email ? <span className="text-cyan-300">{emp.email}</span> : <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">Sin correo</span>}</td>
                        <td className="px-5 py-5">{emp.usuario_id ? <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">Activo</span> : <span className="rounded-full border border-slate-600 bg-slate-800/70 px-3 py-1 text-xs font-bold text-slate-300">Pendiente</span>}</td>
                        <td className="px-5 py-5">{emp.usuario_id ? <button type="button" onClick={() => retirarAcceso(emp)} className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/20">Retirar acceso</button> : <button type="button" onClick={() => abrirCrearAcceso(emp)} className="rounded-xl border border-cyan-300/30 bg-cyan-400 px-4 py-2 text-xs font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300">Crear acceso</button>}</td>
                      </tr>
                    ))}
                    {!loading && empleadosFiltrados.length === 0 && (
                      <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-500">No hay empleados para mostrar.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <aside className="rounded-[2rem] border border-cyan-400/15 bg-slate-950/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
              {!empleadoSeleccionado ? (
                <div className="flex h-full min-h-[500px] flex-col items-center justify-center text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] border border-cyan-300/30 bg-cyan-400/10 text-4xl shadow-xl shadow-cyan-500/20">👤</div>
                  <h2 className="mt-6 text-3xl font-black">Selecciona un empleado</h2>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-slate-400">Elige un empleado pendiente para crearle acceso al sistema UMG.</p>
                </div>
              ) : (
                <form onSubmit={crearAcceso} className="space-y-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">Nuevo acceso</p>
                    <h2 className="mt-2 text-3xl font-black">Crear usuario</h2>
                  </div>
                  <div className="rounded-3xl border border-cyan-400/15 bg-cyan-400/[0.04] p-5">
                    <p className="text-sm text-slate-400">Empleado seleccionado</p>
                    <p className="mt-2 text-xl font-black text-white">{empleadoSeleccionado.nombres} {empleadoSeleccionado.apellidos}</p>
                    <p className="mt-1 text-sm text-slate-500">DPI: {empleadoSeleccionado.dpi}</p>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">Correo de acceso</label>
                    <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="empleado@correo.com" className="w-full rounded-2xl border border-cyan-400/15 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">Contraseña inicial</label>
                    <input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} placeholder="Mínimo 6 caracteres" className="w-full rounded-2xl border border-cyan-400/15 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400" />
                  </div>
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-300">Rol del usuario</label>
                    <div className="grid gap-3">
                      {roles.map(item => (
                        <button key={item.value} type="button" onClick={() => setRol(item.value)} className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${rol === item.value ? item.color : 'border-slate-700 bg-black/30 text-slate-400 hover:bg-slate-900'}`}>
                          <p className="font-black">{item.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 rounded-2xl border border-cyan-300/30 bg-cyan-400 px-5 py-4 font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-300">Crear acceso</button>
                    <button type="button" onClick={cerrarPanel} className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 font-bold text-slate-300 transition hover:bg-slate-800">Cancelar</button>
                  </div>
                </form>
              )}
            </aside>
          </div>
        )}

        {vista === 'departamentos' && (
          <section className="rounded-[2rem] border border-cyan-400/15 bg-slate-950/80 p-7 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">Gestión</p>
                <h2 className="mt-2 text-2xl font-black">Departamentos</h2>
              </div>
              <button type="button" onClick={() => setShowFormDepto(!showFormDepto)}
                className={`rounded-2xl px-6 py-3 font-bold transition ${showFormDepto ? 'border border-red-400/30 bg-red-500/10 text-red-300' : 'border border-cyan-300/30 bg-cyan-400 text-slate-950'}`}>
                {showFormDepto ? '✕ Cancelar' : '+ Nuevo Departamento'}
              </button>
            </div>

            {showFormDepto && (
              <form onSubmit={crearDepartamento} className="mb-6 grid gap-4 rounded-2xl border border-cyan-400/15 bg-black/30 p-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Nombre *</label>
                  <input type="text" required value={formDepto.nombre} onChange={e => setFormDepto({ ...formDepto, nombre: e.target.value })} placeholder="Ej: Recursos Humanos"
                    className="w-full rounded-2xl border border-cyan-400/15 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Descripción</label>
                  <input type="text" value={formDepto.descripcion} onChange={e => setFormDepto({ ...formDepto, descripcion: e.target.value })} placeholder="Descripción breve"
                    className="w-full rounded-2xl border border-cyan-400/15 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400" />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="rounded-2xl border border-cyan-300/30 bg-cyan-400 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-300">✓ Guardar Departamento</button>
                </div>
              </form>
            )}

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-cyan-400/[0.04]">
                  {['#', 'Nombre', 'Descripción', 'Acciones'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {departamentos.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-12 text-center text-sm text-slate-500">No hay departamentos. ¡Crea el primero!</td></tr>
                ) : departamentos.map(dep => (
                  <tr key={dep.id} className="border-t border-cyan-400/5 transition hover:bg-cyan-400/[0.04]">
                    <td className="px-5 py-4 text-sm text-slate-500">#{dep.id}</td>
                    <td className="px-5 py-4 font-bold text-white">{dep.nombre}</td>
                    <td className="px-5 py-4 text-sm text-slate-400">{dep.descripcion || '—'}</td>
                    <td className="px-5 py-4">
                      <button type="button" onClick={() => eliminarDepartamento(dep.id, dep.nombre)} className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/20">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {vista === 'puestos' && (
          <section className="rounded-[2rem] border border-cyan-400/15 bg-slate-950/80 p-7 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">Gestión</p>
                <h2 className="mt-2 text-2xl font-black">Puestos</h2>
              </div>
              <button type="button" onClick={() => setShowFormPuesto(!showFormPuesto)}
                className={`rounded-2xl px-6 py-3 font-bold transition ${showFormPuesto ? 'border border-red-400/30 bg-red-500/10 text-red-300' : 'border border-cyan-300/30 bg-cyan-400 text-slate-950'}`}>
                {showFormPuesto ? '✕ Cancelar' : '+ Nuevo Puesto'}
              </button>
            </div>

            {showFormPuesto && (
              <form onSubmit={crearPuesto} className="mb-6 grid gap-4 rounded-2xl border border-cyan-400/15 bg-black/30 p-6 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Nombre *</label>
                  <input type="text" required value={formPuesto.nombre} onChange={e => setFormPuesto({ ...formPuesto, nombre: e.target.value })} placeholder="Ej: Analista"
                    className="w-full rounded-2xl border border-cyan-400/15 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Departamento *</label>
                  <select required value={formPuesto.departamento_id} onChange={e => setFormPuesto({ ...formPuesto, departamento_id: e.target.value })}
                    className="w-full rounded-2xl border border-cyan-400/15 bg-black/40 px-4 py-3 text-white outline-none focus:border-cyan-400">
                    <option value="">Seleccionar...</option>
                    {departamentos.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Salario Base (Q)</label>
                  <input type="number" min="0" value={formPuesto.salario_base} onChange={e => setFormPuesto({ ...formPuesto, salario_base: e.target.value })} placeholder="Ej: 5000"
                    className="w-full rounded-2xl border border-cyan-400/15 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400" />
                </div>
                <div className="md:col-span-3">
                  <button type="submit" className="rounded-2xl border border-cyan-300/30 bg-cyan-400 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-300">✓ Guardar Puesto</button>
                </div>
              </form>
            )}

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-cyan-400/[0.04]">
                  {['#', 'Puesto', 'Departamento', 'Salario Base', 'Acciones'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {puestos.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">No hay puestos. ¡Crea el primero!</td></tr>
                ) : puestos.map(p => (
                  <tr key={p.id} className="border-t border-cyan-400/5 transition hover:bg-cyan-400/[0.04]">
                    <td className="px-5 py-4 text-sm text-slate-500">#{p.id}</td>
                    <td className="px-5 py-4 font-bold text-white">{p.nombre}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-bold text-violet-300">
                        {departamentos.find(d => d.id === p.departamento_id)?.nombre || 'Sin departamento'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-cyan-300">{p.salario_base ? `Q${Number(p.salario_base).toLocaleString()}` : '—'}</td>
                    <td className="px-5 py-4">
                      <button type="button" onClick={() => eliminarPuesto(p.id, p.nombre)} className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/20">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

      </div>
    </div>
  );
}