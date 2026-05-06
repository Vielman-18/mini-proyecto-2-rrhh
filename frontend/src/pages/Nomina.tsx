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
  const pagoHora = salarioBase / 30 / 8;
  const montoHorasExtra = horasExtra * pagoHora * 1.5;

  const subtotalIngresos =
    salarioBase + montoHorasExtra + bonificaciones + comisiones;

  const subtotalDeducciones = deducciones + descuentosLegales;

  const totalEstimado = subtotalIngresos - subtotalDeducciones;

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

  const cargarDetalles = async (id: string) => {
    if (!id) return;

    try {
      const res = await api.get(`/nomina/${id}/detalle`);
      setDetalles(res.data);
    } catch {
      setDetalles([]);
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

  const cambiarNomina = (id: string) => {
    setNominaId(id);
    cargarDetalles(id);
  };

  return (
    <div className="space-y-8 text-white">
      <section className="overflow-hidden rounded-3xl border border-blue-500/10 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 shadow-2xl">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-400">
              Recursos Humanos
            </p>
            <h1 className="mt-2 text-4xl font-black">Módulo de Nómina</h1>
            <p className="mt-3 max-w-3xl text-slate-400">
              Administra períodos, calcula salarios y consulta el desglose de
              pagos por empleado.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Nómina activa</p>
            <p className="mt-1 text-2xl font-black text-white">
              {nominaSeleccionada?.periodo || 'Sin seleccionar'}
            </p>
            <p className="mt-1 text-sm capitalize text-blue-300">
              {nominaSeleccionada
                ? `${nominaSeleccionada.tipo_periodo} · ${nominaSeleccionada.estado}`
                : 'Selecciona una nómina'}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-4">
        <Card titulo="Total planilla" valor={quetzal(resumen.totalPlanilla)} />
        <Card titulo="Bonos y comisiones" valor={quetzal(resumen.totalBonos)} />
        <Card titulo="Deducciones" valor={quetzal(resumen.totalDeducciones)} />
        <Card titulo="Empleados incluidos" valor={String(detalles.length)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <Panel
            paso="01"
            titulo="Crear período"
            descripcion="Crea una nómina mensual o quincenal antes de agregar empleados."
          >
            <div className="space-y-4">
              <Campo label="Tipo de período">
                <select
                  value={tipoPeriodo}
                  onChange={(e) => setTipoPeriodo(e.target.value)}
                  className="input"
                >
                  <option value="mensual">Mensual</option>
                  <option value="quincenal">Quincenal</option>
                </select>
              </Campo>

              <Campo label="Período">
                <input
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  placeholder="Ej: 2026-04"
                  className="input"
                />
              </Campo>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                <Campo label="Fecha inicio">
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="input"
                  />
                </Campo>

                <Campo label="Fecha fin">
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="input"
                  />
                </Campo>
              </div>

              <button
                onClick={crearNomina}
                disabled={loading}
                className="w-full rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60"
              >
                Crear período
              </button>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-8">
          <Panel
            paso="02"
            titulo="Manipular nómina"
            descripcion="Selecciona una nómina existente y agrega empleados activos con sus conceptos salariales."
          >
            <div className="mb-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
              <Campo label="Seleccionar nómina">
                <select
                  value={nominaId}
                  onChange={(e) => cambiarNomina(e.target.value)}
                  className="input"
                >
                  <option value="">Seleccionar nómina</option>
                  {nominas.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.periodo} - {n.tipo_periodo} - {n.estado}
                    </option>
                  ))}
                </select>
              </Campo>

              {nominaSeleccionada && (
                <div className="mt-5 grid gap-3 md:grid-cols-4">
                  <MiniInfo label="Tipo" value={nominaSeleccionada.tipo_periodo} />
                  <MiniInfo label="Estado" value={nominaSeleccionada.estado} />
                  <MiniInfo
                    label="Inicio"
                    value={fechaGT(nominaSeleccionada.fecha_inicio)}
                  />
                  <MiniInfo
                    label="Fin"
                    value={fechaGT(nominaSeleccionada.fecha_fin)}
                  />
                </div>
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
                <h3 className="text-lg font-black">Datos del empleado</h3>

                <div className="mt-5 space-y-4">
                  <Campo label="Empleado activo">
                    <select
                      value={empleadoId}
                      onChange={(e) => setEmpleadoId(e.target.value)}
                      className="input"
                    >
                      <option value="">Seleccionar empleado</option>
                      {empleados.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.nombres} {e.apellidos}
                        </option>
                      ))}
                    </select>
                  </Campo>

                  {empleadoSeleccionado && (
                    <div className="rounded-2xl border border-blue-500/10 bg-blue-500/5 p-4">
                      <p className="font-bold text-white">
                        {empleadoSeleccionado.nombres}{' '}
                        {empleadoSeleccionado.apellidos}
                      </p>
                      <p className="text-sm text-slate-400">
                        {empleadoSeleccionado.cargo || 'Sin cargo'} ·{' '}
                        {empleadoSeleccionado.departamento || 'Sin departamento'}
                      </p>
                      <p className="mt-2 text-lg font-black text-emerald-400">
                        {quetzal(salarioBase)}
                      </p>
                    </div>
                  )}

                  <Input
                    label="Horas trabajadas"
                    value={horasTrabajadas}
                    setValue={setHorasTrabajadas}
                  />
                  <Input
                    label="Horas extra"
                    value={horasExtra}
                    setValue={setHorasExtra}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
                <h3 className="text-lg font-black">Conceptos salariales</h3>

                <div className="mt-5 space-y-4">
                  <Input
                    label="Bonificaciones"
                    value={bonificaciones}
                    setValue={setBonificaciones}
                  />
                  <Input
                    label="Comisiones"
                    value={comisiones}
                    setValue={setComisiones}
                  />
                  <Input
                    label="Deducciones"
                    value={deducciones}
                    setValue={setDeducciones}
                  />
                  <Input
                    label="Descuentos legales"
                    value={descuentosLegales}
                    setValue={setDescuentosLegales}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-blue-500/10 bg-slate-950 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-black">Vista previa del cálculo</h3>
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
                  IGSS / IRTRA se calculan en backend
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Resumen label="Salario base" value={quetzal(salarioBase)} />
                <Resumen label="Pago hora" value={quetzal(pagoHora)} />
                <Resumen label="Monto extra" value={quetzal(montoHorasExtra)} />
                <Resumen label="Ingresos" value={quetzal(subtotalIngresos)} />
                <Resumen
                  label="Deducciones manuales"
                  value={quetzal(subtotalDeducciones)}
                />
                <Resumen
                  label="Total estimado"
                  value={quetzal(totalEstimado)}
                  strong
                />
              </div>

              <button
                onClick={agregarDetalle}
                disabled={loading}
                className="mt-6 rounded-2xl bg-emerald-600 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-60"
              >
                Agregar empleado a nómina
              </button>
            </div>
          </Panel>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
              Paso 03
            </p>
            <h2 className="mt-1 text-xl font-black">Detalle de nómina</h2>
            <p className="text-sm text-slate-400">
              Empleados incluidos en la nómina seleccionada.
            </p>
          </div>

          <button
            onClick={() => nominaId && cargarDetalles(nominaId)}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-900"
          >
            Actualizar detalle
          </button>
        </div>

        {detalles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
            No hay empleados agregados a esta nómina.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="text-slate-400">
                <tr className="border-b border-slate-800">
                  <th className="px-4 py-3">Empleado</th>
                  <th className="px-4 py-3">Salario</th>
                  <th className="px-4 py-3">H. Extra</th>
                  <th className="px-4 py-3">Monto Extra</th>
                  <th className="px-4 py-3">Bonos</th>
                  <th className="px-4 py-3">Comisiones</th>
                  <th className="px-4 py-3">Deducciones</th>
                  <th className="px-4 py-3">IGSS</th>
                  <th className="px-4 py-3">IRTRA</th>
                  <th className="px-4 py-3">Total</th>
                </tr>
              </thead>

              <tbody>
                {detalles.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-slate-900 text-slate-300 hover:bg-slate-900/60"
                  >
                    <td className="px-4 py-4 font-semibold text-white">
                      {d.empleados
                        ? `${d.empleados.nombres} ${d.empleados.apellidos}`
                        : `Empleado #${d.empleado_id}`}
                    </td>
                    <td className="px-4 py-4">{quetzal(d.salario_base)}</td>
                    <td className="px-4 py-4">{Number(d.horas_extra || 0)}</td>
                    <td className="px-4 py-4">{quetzal(d.monto_horas_extra)}</td>
                    <td className="px-4 py-4">{quetzal(d.bonificaciones)}</td>
                    <td className="px-4 py-4">{quetzal(d.comisiones)}</td>
                    <td className="px-4 py-4">{quetzal(d.deducciones)}</td>
                    <td className="px-4 py-4">{quetzal(d.igss)}</td>
                    <td className="px-4 py-4">{quetzal(d.irtra)}</td>
                    <td className="px-4 py-4 text-lg font-black text-emerald-400">
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

function Panel({ paso, titulo, descripcion, children }: any) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
        Paso {paso}
      </p>
      <h2 className="mt-1 text-xl font-black text-white">{titulo}</h2>
      <p className="mt-1 mb-6 text-sm text-slate-400">{descripcion}</p>
      {children}
    </section>
  );
}

function Campo({ label, children }: any) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ label, value, setValue }: any) {
  return (
    <Campo label={label}>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="input"
      />
    </Campo>
  );
}

function Card({ titulo, valor }: any) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl">
      <p className="text-sm text-slate-400">{titulo}</p>
      <p className="mt-2 text-2xl font-black text-white">{valor}</p>
    </div>
  );
}

function MiniInfo({ label, value }: any) {
  return (
    <div className="rounded-2xl bg-slate-950 p-4">
      <p className="text-xs uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-bold capitalize text-white">{value}</p>
    </div>
  );
}

function Resumen({ label, value, strong }: any) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3">
      <span className="text-slate-400">{label}</span>
      <span
        className={
          strong ? 'font-black text-emerald-400' : 'font-bold text-blue-400'
        }
      >
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