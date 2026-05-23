import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

type Empleado = {
  id: number;
  nombres: string;
  apellidos: string;
  salario: number | string;
  estado: string;
  cargo?: string;
  departamento?: string;
};

type Nomina = {
  id: number;
  tipo_periodo: string;
  periodo: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
};

type DetalleNomina = {
  id: number;
  nomina_id: number;
  empleado_id: number;
  salario_base: number | string;
  horas_trabajadas?: number | string;
  horas_extra?: number | string;
  monto_horas_extra?: number | string;
  bonificaciones?: number | string;
  comisiones?: number | string;
  deducciones?: number | string;
  descuentos_legales?: number | string;
  igss?: number | string;
  irtra?: number | string;
  salario_final: number | string;
  empleados?: Empleado;
};

const inputClass =
  'w-full rounded-2xl border border-cyan-400/15 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10';

export default function Nomina() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [nominas, setNominas] = useState<Nomina[]>([]);
  const [detalles, setDetalles] = useState<DetalleNomina[]>([]);

  const [nominaId, setNominaId] = useState('');
  const [empleadoId, setEmpleadoId] = useState('');

  const [tipoPeriodo, setTipoPeriodo] = useState('mensual');
  const [periodo, setPeriodo] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const [horasTrabajadas, setHorasTrabajadas] = useState(160);
  const [horasExtra, setHorasExtra] = useState(0);
  const [bonificaciones, setBonificaciones] = useState(0);
  const [comisiones, setComisiones] = useState(0);
  const [deducciones, setDeducciones] = useState(0);
  const [descuentosLegales, setDescuentosLegales] = useState(0);

  const [loading, setLoading] = useState(false);

  const nominaSeleccionada = nominas.find((n) => String(n.id) === nominaId);

  const empleadoSeleccionado = empleados.find(
    (e) => String(e.id) === empleadoId,
  );

   const salarioBase = Number(empleadoSeleccionado?.salario || 0);

  const resumen = useMemo(() => {
    const totalPlanilla = detalles.reduce(
      (acc, item) => acc + Number(item.salario_final || 0),
      0,
    );

    const totalBonos = detalles.reduce(
      (acc, item) =>
        acc + Number(item.bonificaciones || 0) + Number(item.comisiones || 0),
      0,
    );

    const totalDeducciones = detalles.reduce(
      (acc, item) =>
        acc +
        Number(item.deducciones || 0) +
        Number(item.descuentos_legales || 0) +
        Number(item.igss || 0) +
        Number(item.irtra || 0),
      0,
    );

    return { totalPlanilla, totalBonos, totalDeducciones };
  }, [detalles]);

  const cargarDetalles = async (id: string) => {
    if (!id) return;

    try {
      const res = await api.get(`/nomina/${id}/detalle`);
      setDetalles(res.data);
    } catch {
      setDetalles([]);
    }
  };

  const cargarDatos = async () => {
    try {
      const [empRes, nomRes] = await Promise.all([
        api.get('/empleados'),
        api.get('/nomina'),
      ]);

      setEmpleados(empRes.data.filter((e: Empleado) => e.estado === 'activo'));
      setNominas(nomRes.data);

      if (nomRes.data.length > 0 && !nominaId) {
        const primeraNomina = String(nomRes.data[0].id);
        setNominaId(primeraNomina);
        cargarDetalles(primeraNomina);
      }
    } catch {
      toast.error('Error al cargar información');
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const crearNomina = async () => {
    if (!periodo || !fechaInicio || !fechaFin) {
      toast.error('Completa los datos del período');
      return;
    }

    if (new Date(fechaFin) < new Date(fechaInicio)) {
      toast.error('La fecha fin no puede ser menor que la fecha inicio');
      return;
    }

    try {
      setLoading(true);

      const res = await api.post('/nomina', {
        tipo_periodo: tipoPeriodo,
        periodo,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        estado: 'abierta',
      });

      toast.success('Nómina creada');

      setPeriodo('');
      setFechaInicio('');
      setFechaFin('');

      await cargarDatos();

      const nuevaId = String(res.data.id);
      setNominaId(nuevaId);
      cargarDetalles(nuevaId);
    } catch {
      toast.error('Error al crear nómina');
    } finally {
      setLoading(false);
    }
  };

  const agregarDetalle = async () => {
    if (!nominaId) {
      toast.error('Selecciona una nómina');
      return;
    }

    if (!empleadoId) {
      toast.error('Selecciona un empleado');
      return;
    }

    try {
      setLoading(true);

      await api.post('/nomina/detalle', {
        nomina_id: Number(nominaId),
        empleado_id: Number(empleadoId),
        salario_base: salarioBase,
        horas_trabajadas: horasTrabajadas,
        horas_extra: horasExtra,
        bonificaciones,
        comisiones,
        deducciones,
        descuentos_legales: descuentosLegales,
      });

      toast.success('Empleado agregado a la nómina');

      setEmpleadoId('');
      setHorasTrabajadas(160);
      setHorasExtra(0);
      setBonificaciones(0);
      setComisiones(0);
      setDeducciones(0);
      setDescuentosLegales(0);
      
      cargarDetalles(nominaId);
    } catch {
      toast.error('Error al agregar detalle');
    } finally {
      setLoading(false);
    }
  };
   const generarPdf = async () => {
  if (!nominaId) {
    toast.error('Selecciona una nómina');
    return;
  }

  try {
    setLoading(true);

    const res = await api.get(`/nomina/${nominaId}/pdf`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `nomina_${nominaSeleccionada?.periodo}.pdf`);

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);

    toast.success('PDF generado');
  } catch {
    toast.error('Error al generar PDF');
  } finally {
    setLoading(false);
  }
};


  const cambiarNomina = (id: string) => {
    setNominaId(id);
    cargarDetalles(id);
  };

  return (
    <div className="min-h-screen space-y-8 bg-slate-950 p-6 text-white">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-cyan-400/20 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.14),transparent_32%)]" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] border border-cyan-400/30 bg-cyan-400/10 shadow-lg shadow-cyan-500/20">
              <span className="text-3xl font-black text-cyan-300">UMG</span>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-cyan-300">
                Universidad Mariano Gálvez
              </p>

              <h1 className="mt-2 text-5xl font-black tracking-tight text-white">
                Módulo de Nómina
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                Control de períodos, cálculo de pagos, bonos, deducciones y detalle salarial.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-black/30 px-6 py-5">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Nómina activa
            </p>

            <p className="mt-2 text-2xl font-black text-cyan-300">
              {nominaSeleccionada?.periodo || 'Sin seleccionar'}
            </p>

            <p className="mt-1 text-sm capitalize text-slate-400">
              {nominaSeleccionada
                ? `${nominaSeleccionada.tipo_periodo} · ${nominaSeleccionada.estado}`
                : 'Selecciona una nómina'}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Total planilla" value={quetzal(resumen.totalPlanilla)} color="cyan" />
        <Card title="Bonos y comisiones" value={quetzal(resumen.totalBonos)} color="emerald" />
        <Card title="Deducciones" value={quetzal(resumen.totalDeducciones)} color="red" />
        <Card title="Empleados incluidos" value={String(detalles.length)} color="violet" />
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <Panel className="xl:col-span-4" tag="Paso 01" title="Crear período">
          <div className="space-y-5">
            <Field label="Tipo de período">
              <select
                value={tipoPeriodo}
                onChange={(e) => setTipoPeriodo(e.target.value)}
                className={inputClass}
              >
                <option value="mensual">Mensual</option>
                <option value="quincenal">Quincenal</option>
              </select>
            </Field>

            <Field label="Período">
              <input
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                placeholder="Ej: 2026-04"
                className={inputClass}
              />
            </Field>

            <Field label="Fecha inicio">
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Fecha fin">
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className={inputClass}
              />
            </Field>

            <button
              type="button"
              onClick={crearNomina}
              disabled={loading}
              className="w-full rounded-2xl border border-cyan-300/30 bg-cyan-400 px-5 py-4 font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Procesando...' : 'Crear período'}
            </button>
          </div>
        </Panel>

        <Panel className="xl:col-span-8" tag="Paso 02" title="Manipular nómina">
          <div className="mb-6 rounded-[1.7rem] border border-cyan-400/15 bg-black/30 p-5">
            <Field label="Seleccionar nómina">
              <select
                value={nominaId}
                onChange={(e) => cambiarNomina(e.target.value)}
                className={inputClass}
              >
                <option value="">Seleccionar nómina</option>
                {nominas.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.periodo} - {n.tipo_periodo} - {n.estado}
                  </option>
                ))}
              </select>
            </Field>

            {nominaSeleccionada && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MiniInfo label="Tipo" value={nominaSeleccionada.tipo_periodo} />
                <MiniInfo label="Estado" value={nominaSeleccionada.estado} />
                <MiniInfo label="Inicio" value={fechaGT(nominaSeleccionada.fecha_inicio)} />
                <MiniInfo label="Fin" value={fechaGT(nominaSeleccionada.fecha_fin)} />
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.7rem] border border-cyan-400/15 bg-black/30 p-5">
              <h3 className="text-lg font-black text-white">Datos del empleado</h3>

              <div className="mt-5 space-y-4">
                <Field label="Empleado activo">
                  <select
                    value={empleadoId}
                    onChange={(e) => setEmpleadoId(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Seleccionar empleado</option>
                    {empleados.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nombres} {e.apellidos}
                      </option>
                    ))}
                  </select>
                </Field>

                {empleadoSeleccionado && (
                  <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                    <p className="font-black text-white">
                      {empleadoSeleccionado.nombres} {empleadoSeleccionado.apellidos}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {empleadoSeleccionado.cargo || 'Sin cargo'} ·{' '}
                      {empleadoSeleccionado.departamento || 'Sin departamento'}
                    </p>
                    <p className="mt-3 text-2xl font-black text-emerald-300">
                      {quetzal(salarioBase)}
                    </p>
                  </div>
                )}

                <NumberInput label="Horas trabajadas" value={horasTrabajadas} setValue={setHorasTrabajadas} />
                <NumberInput label="Horas extra" value={horasExtra} setValue={setHorasExtra} />
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-violet-400/15 bg-black/30 p-5">
              <h3 className="text-lg font-black text-white">Conceptos salariales</h3>

              <div className="mt-5 space-y-4">
                <NumberInput label="Bonificaciones" value={bonificaciones} setValue={setBonificaciones} />
                <NumberInput label="Comisiones" value={comisiones} setValue={setComisiones} />
                <NumberInput label="Deducciones" value={deducciones} setValue={setDeducciones} />
                <NumberInput label="Descuentos legales" value={descuentosLegales} setValue={setDescuentosLegales} />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[1.8rem] border border-cyan-400/15 bg-slate-950/80 p-5">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
                  UMG Preview
                </p>
                <h3 className="mt-1 text-xl font-black">Vista previa del cálculo</h3>
              </div>

              <span className="w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-300">
                IGSS / IRTRA en backend
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
             <Resumen label="Salario Base" value ={quetzal(salarioBase)}/>
            </div>

            <button
              type="button"
              onClick={agregarDetalle}
              disabled={loading}
              className="mt-6 rounded-2xl border border-emerald-300/30 bg-emerald-400 px-6 py-4 font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Procesando...' : 'Agregar empleado a nómina'}
            </button>
          </div>
        </Panel>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-slate-900/80 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="flex flex-col gap-4 border-b border-cyan-400/10 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
              Paso 03 · UMG Nómina
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">
              Detalle de nómina
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Empleados incluidos en el período seleccionado.
            </p>
          </div>
          <button
            type="button"
            onClick={() => nominaId && cargarDetalles(nominaId)}
            className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400/20"
          >
            Actualizar detalle
          </button>
          <button
      type="button"
      onClick={generarPdf}
      disabled={loading || !nominaId}
      className="rounded-2xl border border-emerald-400/20 bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? 'Generando...' : 'Exportar PDF'}
    </button>
        </div>

        {detalles.length === 0 ? (
          <div className="m-6 rounded-3xl border border-dashed border-slate-700 bg-black/30 p-10 text-center text-slate-500">
            No hay empleados agregados a esta nómina.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-cyan-400/10 bg-cyan-400/[0.04] text-xs uppercase tracking-widest text-slate-500">
                  <th className="px-5 py-4">Empleado</th>
                  <th className="px-5 py-4">Salario</th>
                  <th className="px-5 py-4">H. Extra</th>
                  <th className="px-5 py-4">Monto Extra</th>
                  <th className="px-5 py-4">Bonos</th>
                  <th className="px-5 py-4">Comisiones</th>
                  <th className="px-5 py-4">Deducciones</th>
                  <th className="px-5 py-4">IGSS</th>
                  <th className="px-5 py-4">IRTRA</th>
                  <th className="px-5 py-4">Total</th>
                </tr>
              </thead>

              <tbody>
                {detalles.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-cyan-400/5 text-slate-300 transition hover:bg-cyan-400/[0.04]"
                  >
                    <td className="px-5 py-5 font-bold text-white">
                      {d.empleados
                        ? `${d.empleados.nombres} ${d.empleados.apellidos}`
                        : `Empleado #${d.empleado_id}`}
                    </td>
                    <td className="px-5 py-5">{quetzal(d.salario_base)}</td>
                    <td className="px-5 py-5">{Number(d.horas_extra || 0)}</td>
                    <td className="px-5 py-5">{quetzal(d.monto_horas_extra)}</td>
                    <td className="px-5 py-5 text-emerald-300">{quetzal(d.bonificaciones)}</td>
                    <td className="px-5 py-5 text-emerald-300">{quetzal(d.comisiones)}</td>
                    <td className="px-5 py-5 text-red-300">{quetzal(d.deducciones)}</td>
                    <td className="px-5 py-5">{quetzal(d.igss)}</td>
                    <td className="px-5 py-5">{quetzal(d.irtra)}</td>
                    <td className="px-5 py-5 text-lg font-black text-cyan-300">
                      {quetzal(d.salario_final)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: 'cyan' | 'emerald' | 'red' | 'violet';
}) {
  const colors = {
    cyan: 'border-cyan-400/20 text-cyan-300',
    emerald: 'border-emerald-400/20 text-emerald-300',
    red: 'border-red-400/20 text-red-300',
    violet: 'border-violet-400/20 text-violet-300',
  };

  return (
    <div className={`rounded-[1.7rem] border bg-slate-900/80 p-5 shadow-lg shadow-black/30 backdrop-blur-xl ${colors[color]}`}>
      <p className="text-sm text-slate-400">{title}</p>
      <p className={`mt-3 text-3xl font-black ${colors[color]}`}>{value}</p>
    </div>
  );
}

function Panel({
  tag,
  title,
  children,
  className = '',
}: {
  tag: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-[2rem] border border-cyan-400/15 bg-slate-900/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl ${className}`}>
      <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
        {tag}
      </p>
      <h2 className="mb-6 mt-2 text-2xl font-black text-white">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-300">
        {label}
      </label>
      {children}
    </div>
  );
}

function NumberInput({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className={inputClass}
      />
    </Field>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-slate-950/80 p-4">
      <p className="text-xs uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-bold capitalize text-white">{value}</p>
    </div>
  );
}

function Resumen({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-cyan-400/10 bg-black/30 px-4 py-3">
      <span className="text-slate-400">{label}</span>
      <span className={strong ? 'font-black text-emerald-300' : 'font-bold text-cyan-300'}>
        {value}
      </span>
    </div>
  );
}

function quetzal(value: any) {
  return `Q${Number(value || 0).toFixed(2)}`;
}

function fechaGT(value: string) {
  if (!value) return '---';
  return new Date(value).toLocaleDateString('es-GT');
}