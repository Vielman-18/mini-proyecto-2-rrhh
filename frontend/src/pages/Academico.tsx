import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type Empleado = {
  id: number;
  nombres: string;
  apellidos: string;
  dpi: string;
};

type RegistroAcademico = {
  id: number;
  empleado_id: number;
  titulo: string;
  institucion: string;
  fecha_graduacion: string | null;
  empleados?: Empleado;
};

type FormAcademico = {
  empleado_id: string;
  titulo: string;
  institucion: string;
  fecha_graduacion: string;
};

const formInicial: FormAcademico = {
  empleado_id: '',
  titulo: '',
  institucion: '',
  fecha_graduacion: '',
};

export default function Academico() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [registros, setRegistros] = useState<RegistroAcademico[]>([]);
  const [form, setForm] = useState<FormAcademico>(formInicial);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarLista, setMostrarLista] = useState(false);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resEmpleados, resAcademico] = await Promise.all([
        api.get('/empleados'),
        api.get('/academico'),
      ]);
      const ordenados = resEmpleados.data.sort((a: Empleado, b: Empleado) =>
        `${a.nombres} ${a.apellidos}`.localeCompare(`${b.nombres} ${b.apellidos}`)
      );
      setEmpleados(ordenados);
      setRegistros(resAcademico.data);
    } catch (error: any) {
      toast.error('Error al cargar información académica');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const guardarAcademico = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.empleado_id) { toast.error('Selecciona un empleado'); return; }
    if (!form.titulo.trim()) { toast.error('El título académico es obligatorio'); return; }
    if (!form.institucion.trim()) { toast.error('La institución es obligatoria'); return; }

    const payload = {
      empleado_id: Number(form.empleado_id),
      titulo: form.titulo.trim(),
      institucion: form.institucion.trim(),
      fecha_graduacion: form.fecha_graduacion || null,
    };

    try {
      await api.post('/academico', payload);
      toast.success('Registro académico guardado');
      setForm(formInicial);
      setBusqueda('');
      setMostrarLista(false);
      cargarDatos();
    } catch (error: any) {
      toast.error(error.response?.data?.message?.[0] || error.response?.data?.message || 'Error al guardar registro académico');
    }
  };

  const eliminarRegistro = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este registro académico?')) return;
    try {
      await api.delete(`/academico/${id}`);
      toast.success('Registro académico eliminado');
      cargarDatos();
    } catch (error: any) {
      toast.error('No se pudo eliminar el registro');
    }
  };

  const descargarPdfEmpleado = (empleadoId: number) => {
    const emp = empleados.find(e => e.id === empleadoId);
    const registrosEmpleado = registros.filter(r => r.empleado_id === empleadoId);

    if (registrosEmpleado.length === 0) {
      toast.error('Este empleado no tiene registros académicos');
      return;
    }

    const doc = new jsPDF();

    doc.setFillColor(2, 6, 23);
    doc.rect(0, 0, 210, 42, 'F');
    doc.setTextColor(34, 211, 238);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('UMG', 15, 18);
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('Universidad Mariano Galvez de Guatemala', 15, 28);
    doc.setFontSize(9);
    doc.setTextColor(150, 200, 255);
    doc.text('Sistema de Recursos Humanos — Informacion Academica', 15, 37);

    doc.setTextColor(2, 6, 23);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de Formacion Academica', 15, 58);

    doc.setDrawColor(34, 211, 238);
    doc.setLineWidth(0.8);
    doc.line(15, 62, 195, 62);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('Empleado:', 15, 72);
    doc.setFont('helvetica', 'normal');
    doc.text(`${emp?.nombres} ${emp?.apellidos}`, 45, 72);

    doc.setFont('helvetica', 'bold');
    doc.text('DPI:', 15, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(`${emp?.dpi}`, 45, 80);

    doc.setFont('helvetica', 'bold');
    doc.text('Fecha:', 15, 88);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date().toLocaleDateString('es-GT'), 45, 88);

    doc.setFont('helvetica', 'bold');
    doc.text('Total registros:', 15, 96);
    doc.setFont('helvetica', 'normal');
    doc.text(`${registrosEmpleado.length}`, 50, 96);

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(15, 100, 195, 100);

    autoTable(doc, {
      startY: 107,
      head: [['#', 'Titulo / Certificacion', 'Institucion Educativa', 'Fecha de Graduacion']],
      body: registrosEmpleado.map((r, i) => [
        String(i + 1),
        r.titulo,
        r.institucion,
        r.fecha_graduacion ? r.fecha_graduacion.substring(0, 10) : 'Sin fecha',
      ]),
      headStyles: {
        fillColor: [2, 6, 23],
        textColor: [34, 211, 238],
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center',
      },
      bodyStyles: { fontSize: 9, textColor: [30, 30, 30], halign: 'left' },
      columnStyles: {
        0: { halign: 'center', cellWidth: 12 },
        1: { cellWidth: 65 },
        2: { cellWidth: 65 },
        3: { halign: 'center', cellWidth: 40 },
      },
      alternateRowStyles: { fillColor: [240, 248, 255] },
      styles: { lineColor: [200, 200, 200], lineWidth: 0.1, cellPadding: 4 },
    });

    const pageHeight = doc.internal.pageSize.height;
    doc.setFillColor(2, 6, 23);
    doc.rect(0, pageHeight - 18, 210, 18, 'F');
    doc.setTextColor(150, 200, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Universidad Mariano Galvez — Sistema RRHH', 15, pageHeight - 7);
    doc.text(`Generado el ${new Date().toLocaleDateString('es-GT')}`, 140, pageHeight - 7);

    doc.save(`academico_${emp?.nombres}_${emp?.apellidos}.pdf`);
  };

  const descargarPdfTodos = () => {
    if (registros.length === 0) { toast.error('No hay registros académicos'); return; }

    const doc = new jsPDF();

    doc.setFillColor(2, 6, 23);
    doc.rect(0, 0, 210, 42, 'F');
    doc.setTextColor(34, 211, 238);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('UMG', 15, 18);
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('Universidad Mariano Galvez de Guatemala', 15, 28);
    doc.setFontSize(9);
    doc.setTextColor(150, 200, 255);
    doc.text('Sistema de Recursos Humanos — Reporte General Academico', 15, 37);

    doc.setTextColor(2, 6, 23);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte General de Formacion Academica', 15, 58);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);
    doc.text(`Fecha de generacion: ${new Date().toLocaleDateString('es-GT')}`, 15, 67);
    doc.text(`Total de registros: ${registros.length}`, 15, 74);

    doc.setDrawColor(34, 211, 238);
    doc.setLineWidth(0.8);
    doc.line(15, 78, 195, 78);

    autoTable(doc, {
      startY: 85,
      head: [['#', 'Empleado', 'DPI', 'Titulo / Certificacion', 'Institucion', 'Fecha']],
      body: registros.map((r, i) => [
        String(i + 1),
        r.empleados ? `${r.empleados.nombres} ${r.empleados.apellidos}` : `ID: ${r.empleado_id}`,
        r.empleados?.dpi || '—',
        r.titulo,
        r.institucion,
        r.fecha_graduacion ? r.fecha_graduacion.substring(0, 10) : 'Sin fecha',
      ]),
      headStyles: {
        fillColor: [2, 6, 23],
        textColor: [34, 211, 238],
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center',
      },
      bodyStyles: { fontSize: 8, textColor: [30, 30, 30] },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 45 },
        4: { cellWidth: 40 },
        5: { halign: 'center', cellWidth: 25 },
      },
      alternateRowStyles: { fillColor: [240, 248, 255] },
      styles: { lineColor: [200, 200, 200], lineWidth: 0.1, cellPadding: 3 },
    });

    const pageHeight = doc.internal.pageSize.height;
    doc.setFillColor(2, 6, 23);
    doc.rect(0, pageHeight - 18, 210, 18, 'F');
    doc.setTextColor(150, 200, 255);
    doc.setFontSize(8);
    doc.text('Universidad Mariano Galvez — Sistema RRHH', 15, pageHeight - 7);
    doc.text(`Generado el ${new Date().toLocaleDateString('es-GT')}`, 140, pageHeight - 7);

    doc.save(`academico_todos_${new Date().toLocaleDateString('es-GT')}.pdf`);
  };

  const empleadosFiltrados = empleados.filter((emp) =>
    `${emp.nombres} ${emp.apellidos}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const empleadoSeleccionado = empleados.find(e => String(e.id) === form.empleado_id);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] p-6 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.23),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.22),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(37,99,235,0.18),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:54px_54px]" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-[2.2rem] border border-cyan-400/20 bg-slate-950/80 p-8 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] border border-cyan-300/40 bg-cyan-400/10 shadow-xl shadow-cyan-500/20">
              <span className="text-3xl font-black text-cyan-300">UMG</span>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-cyan-300">Universidad Mariano Gálvez</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Información Académica</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Registro de títulos, certificaciones e instituciones por empleado.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
          <form onSubmit={guardarAcademico} className="rounded-[2rem] border border-cyan-400/15 bg-slate-950/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="mb-6 border-b border-cyan-400/10 pb-5">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">Nuevo registro</p>
              <h2 className="mt-2 text-2xl font-black text-white">Formación académica</h2>
            </div>

            <div className="space-y-5">
              <Field label="Buscar empleado">
                <div className="relative">
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => { setBusqueda(e.target.value); setMostrarLista(true); }}
                    onFocus={() => setMostrarLista(true)}
                    placeholder="Escribe el nombre..."
                    className="w-full rounded-2xl border border-cyan-400/15 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                  />
                  {mostrarLista && empleadosFiltrados.length > 0 && (
                    <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-2xl border border-cyan-400/15 bg-slate-900 shadow-xl">
                      {empleadosFiltrados.map((emp) => (
                        <button
                          key={emp.id}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, empleado_id: String(emp.id) });
                            setBusqueda(`${emp.nombres} ${emp.apellidos}`);
                            setMostrarLista(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm transition hover:bg-cyan-500/20 ${
                            form.empleado_id === String(emp.id) ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-white'
                          }`}
                        >
                          {emp.nombres} {emp.apellidos} - {emp.dpi}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {empleadoSeleccionado && (
                  <p className="mt-2 text-xs text-cyan-400">✓ Seleccionado: <span className="font-semibold">{empleadoSeleccionado.nombres} {empleadoSeleccionado.apellidos}</span></p>
                )}
              </Field>

              <Field label="Título o certificación">
                <input type="text" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ej: Ingeniería en Sistemas"
                  className="w-full rounded-2xl border border-cyan-400/15 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400" />
              </Field>

              <Field label="Institución educativa">
                <input type="text" value={form.institucion} onChange={(e) => setForm({ ...form, institucion: e.target.value })}
                  placeholder="Ej: Universidad Mariano Gálvez"
                  className="w-full rounded-2xl border border-cyan-400/15 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400" />
              </Field>

              <Field label="Fecha de graduación">
                <input type="date" value={form.fecha_graduacion} onChange={(e) => setForm({ ...form, fecha_graduacion: e.target.value })}
                  className="w-full rounded-2xl border border-cyan-400/15 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400" />
              </Field>

              <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                <button type="submit"
                  className="flex-1 rounded-2xl border border-cyan-300/30 bg-cyan-400 px-6 py-4 font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-300">
                  Guardar registro
                </button>
                <button type="button" onClick={() => { setForm(formInicial); setBusqueda(''); setMostrarLista(false); }}
                  className="rounded-2xl border border-slate-700 bg-slate-900 px-6 py-4 font-bold text-slate-300 transition hover:bg-slate-800">
                  Limpiar
                </button>
              </div>
            </div>
          </form>

          <section className="overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-slate-950/80 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="flex flex-col gap-2 border-b border-cyan-400/10 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">UMG Académico</p>
                <h2 className="mt-2 text-2xl font-black text-white">Registros académicos</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300">
                  {loading ? 'Cargando...' : `${registros.length} registros`}
                </span>
                <button type="button" onClick={descargarPdfTodos}
                  className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm font-bold text-violet-300 transition hover:bg-violet-500/20">
                  Exportar todo
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-cyan-400/[0.04]">
                    {['Empleado', 'Título / Certificación', 'Institución', 'Fecha', 'Acciones'].map((h) => (
                      <th key={h} className="px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {registros.map((item) => (
                    <tr key={item.id} className="border-t border-cyan-400/5 transition hover:bg-cyan-400/[0.04]">
                      <td className="px-5 py-5">
                        <p className="font-bold text-white">
                          {item.empleados ? `${item.empleados.nombres} ${item.empleados.apellidos}` : `Empleado ID: ${item.empleado_id}`}
                        </p>
                        <p className="text-xs text-slate-500">{item.empleados?.dpi || 'Sin DPI'}</p>
                      </td>
                      <td className="px-5 py-5 text-sm font-bold text-cyan-300">{item.titulo}</td>
                      <td className="px-5 py-5 text-sm text-slate-400">{item.institucion}</td>
                      <td className="px-5 py-5 text-sm text-slate-400">
                        {item.fecha_graduacion ? item.fecha_graduacion.substring(0, 10) : 'Sin fecha'}
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => descargarPdfEmpleado(item.empleado_id)}
                            className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/20">
                            PDF
                          </button>
                          <button type="button" onClick={() => eliminarRegistro(item.id)}
                            className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/20">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && registros.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">No hay registros académicos.</td></tr>
                  )}
                  {loading && (
                    <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">Cargando información académica...</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-300">{label}</label>
      {children}
    </div>
  );
}