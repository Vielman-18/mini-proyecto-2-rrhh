import React from 'react';

export const quetzal = (v: any) =>
  `Q${Number(v || 0).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`;

const inputS =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none transition-all placeholder:text-slate-600 text-sm";

/**
 * MODAL DE CONFIRMACIÓN
 */
export function ModalConfirmacionAction({
  isOpen,
  onClose,
  onConfirm,
  titulo,
  mensaje,
  loading
}: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm bg-[#0b1017] rounded-2xl p-6 border border-white/10">

        <h3 className="text-xl font-bold text-white mb-3">
          {titulo || 'Confirmación'}
        </h3>

        <p className="text-slate-400 text-sm mb-6">
          {mensaje}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Aceptar'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * MODAL PERIODO
 */
export function ModalPeriodo({ isOpen, onClose, h }: any) {
  if (!isOpen) return null;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const meses = [
    'enero','febrero','marzo','abril','mayo','junio',
    'julio','agosto','septiembre','octubre','noviembre','diciembre'
  ];

  const mesesFiltrados = meses.filter((_, index) => index >= currentMonth);
  const años = Array.from({ length: 5 }, (_, i) => String(currentYear + i));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
      <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-8">

        <h2 className="text-3xl font-black text-white mb-6">
          Crear Nómina
        </h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {['mensual', 'quincenal'].map((tipo) => (
            <button
              key={tipo}
              onClick={() => h.setTipoPeriodo(tipo)}
              className={`py-4 rounded-2xl font-black capitalize ${
                h.tipoPeriodo === tipo
                  ? 'bg-cyan-400 text-black'
                  : 'bg-white/5 text-white'
              }`}
            >
              {tipo}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <select
            className={inputS}
            value={h.mes}
            onChange={(e) => h.setMes(e.target.value)}
          >
            {mesesFiltrados.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            className={inputS}
            value={h.anio}
            onChange={(e) => h.setAnio(e.target.value)}
          >
            {años.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-white/10 rounded-xl text-white">
            Cancelar
          </button>

          <button
            onClick={async () => {
              const ok = await h.crearNomina();
              if (ok) onClose();
            }}
            className="flex-1 py-3 bg-cyan-400 rounded-xl text-black font-bold"
          >
            Generar
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * MODAL DETALLE EMPLEADO (CON EDICIÓN SOLO EN NOMINA ACTIVA)
 */
export function ModalDetalleEmpleado({ isOpen, onClose, detalle, h }: any) {
  if (!isOpen || !detalle) return null;

  const isEditable = h.estadoActual === 'activa';

  const [editMode, setEditMode] = React.useState(false);

  const [form, setForm] = React.useState({
    horas_extra: 0,
    bonificaciones: 0,
    comisiones: 0,
    deducciones: 0
  });

  React.useEffect(() => {
    setForm({
      horas_extra: Number(detalle.horas_extra ?? 0),
      bonificaciones: Number(detalle.bonificaciones ?? 0),
      comisiones: Number(detalle.comisiones ?? 0),
      deducciones: Number(detalle.deducciones ?? 0)
    });
    setEditMode(false);
  }, [detalle]);

  const setField = (field: string, value: number) => {
    setForm(prev => ({
      ...prev,
      [field]: isNaN(value) ? 0 : value
    }));
  };

  // =========================
  // CÁLCULOS
  // =========================

  const IGSS_RATE = 0.0483;
  const IGSS = Number(detalle.salario_base || 0) * IGSS_RATE;

  const BONO_BASE = 250;
  const bonificacionesTotal = BONO_BASE + Number(form.bonificaciones || 0);

  const deduccionesManual = Number(form.deducciones || 0);

  const totalDeducciones = IGSS + deduccionesManual;

  const guardar = async () => {
    if (!isEditable) return;

    const ok = await h.actualizarEmpleadoNomina(detalle.id, form);

    if (ok) {
      setEditMode(false);
      onClose();
    }
  };

  const Card = ({ label, value, color }: any) => (
    <div className="bg-[#05070a] border border-white/5 rounded-xl p-3">
      <p className="text-[10px] text-slate-500 font-bold uppercase">{label}</p>
      <p className={`text-sm font-black mt-1 ${color}`}>{value}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-3">

      <div className="w-full max-w-2xl bg-[#0b1017] border border-white/10 rounded-3xl overflow-hidden">

        {/* HEADER más compacto */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-white/5">
          <div>
            <h2 className="text-xl font-black text-white">
              Detalle de Pago
            </h2>
            <p className="text-cyan-400 text-xs font-bold">
              {detalle.empleados?.nombres} {detalle.empleados?.apellidos}
            </p>
          </div>

          <button onClick={onClose} className="text-white text-lg">
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-5">

          {!editMode ? (
            <div className="grid grid-cols-2 gap-3">

              <Card label="Salario Base" value={quetzal(detalle.salario_base)} color="text-cyan-400" />
              <Card label="IGSS" value={quetzal(IGSS)} color="text-yellow-400" />

              <Card label="Bonificaciones Base" value={quetzal(BONO_BASE)} color="text-emerald-400" />
              <Card label="Bonificaciones Extra" value={quetzal(form.bonificaciones)} color="text-emerald-400" />

              <Card label="Comisiones" value={quetzal(form.comisiones)} color="text-emerald-400" />
              <Card label="Deducciones" value={quetzal(form.deducciones)} color="text-rose-400" />

              <div className="col-span-2 bg-cyan-400/10 border border-cyan-400/20 rounded-xl p-4">
                <p className="text-cyan-300 text-[10px] font-bold uppercase">
                  Bonificación Total (Base + Extras)
                </p>
                <p className="text-xl font-black text-cyan-400">
                  {quetzal(bonificacionesTotal)}
                </p>
              </div>

              <div className="col-span-2 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-300 text-[10px] font-bold uppercase">
                  Total Deducciones
                </p>
                <p className="text-xl font-black text-red-400">
                  {quetzal(totalDeducciones)}
                </p>
              </div>

            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase">
                  Horas Extra
                </label>
                <input
                  type="number"
                  className={inputS}
                  value={form.horas_extra}
                  onChange={(e) => setField("horas_extra", Number(e.target.value))}
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase">
                  Bonificaciones Extra
                </label>
                <input
                  type="number"
                  className={inputS}
                  value={form.bonificaciones}
                  onChange={(e) => setField("bonificaciones", Number(e.target.value))}
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase">
                  Comisiones
                </label>
                <input
                  type="number"
                  className={inputS}
                  value={form.comisiones}
                  onChange={(e) => setField("comisiones", Number(e.target.value))}
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase">
                  Deducciones
                </label>
                <input
                  type="number"
                  className={inputS}
                  value={form.deducciones}
                  onChange={(e) => setField("deducciones", Number(e.target.value))}
                />
              </div>

              {/* resumen lateral */}
              <div className="col-span-2 grid grid-cols-2 gap-3 mt-1">

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                  <p className="text-[10px] text-yellow-300 font-bold">IGSS</p>
                  <p className="text-sm font-black text-yellow-400">
                    {quetzal(IGSS)}
                  </p>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                  <p className="text-[10px] text-emerald-300 font-bold">
                    Bonificación Total
                  </p>
                  <p className="text-sm font-black text-emerald-400">
                    {quetzal(bonificacionesTotal)}
                  </p>
                </div>

              </div>

              <div className="col-span-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <p className="text-[10px] text-red-300 font-bold">
                  Total Deducciones
                </p>
                <p className="text-lg font-black text-red-400">
                  {quetzal(totalDeducciones)}
                </p>
              </div>

            </div>
          )}
        </div>

        {/* FOOTER más compacto */}
        <div className="px-5 pb-4 pt-2 flex gap-2">

          {isEditable && (
            !editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex-1 py-3 bg-cyan-400 text-black font-black rounded-xl"
              >
                Modificar
              </button>
            ) : (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 py-3 bg-white/10 text-white font-bold rounded-xl"
                >
                  Cancelar
                </button>

                <button
                  onClick={guardar}
                  className="flex-1 py-3 bg-emerald-400 text-black font-black rounded-xl"
                >
                  Guardar
                </button>
              </>
            )
          )}

          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white text-black font-black rounded-xl"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}

/**
 * DRAWER EMPLEADO (SIN CAMBIOS FUNCIONALES)
 */
export function DrawerEmpleado({ isOpen, onClose, h }: any) {
  if (!isOpen) return null;

  const empleado = h.empleados.find((e: any) => String(e.id) === h.empleadoId);
  const editable = h.estadoActual === 'activa';

  const InputField = ({ label, value, onChange }: any) => (
    <div>
      <label className="text-xs text-slate-500 font-bold uppercase">
        {label}
      </label>
      <input
        type="number"
        className={`${inputS} ${!editable ? 'opacity-50' : ''}`}
        value={value}
        disabled={!editable}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">

      <div className="w-full max-w-lg bg-[#0b1017] rounded-2xl border border-white/10">

        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-black text-white">
            Empleado
          </h2>
        </div>

        <div className="p-6 grid grid-cols-2 gap-4">

          <InputField label="Horas Extra" value={h.horasExtra} onChange={h.setHorasExtra} />
          <InputField label="Bonificaciones" value={h.bonificaciones} onChange={h.setBonificaciones} />
          <InputField label="Comisiones" value={h.comisiones} onChange={h.setComisiones} />
          <InputField label="Deducciones" value={h.descuentosLegales} onChange={h.setDescuentosLegales} />

        </div>

        <div className="p-6 flex gap-3">
          <button onClick={onClose} className="flex-1 bg-white/10 py-3 rounded-xl">
            Cerrar
          </button>

          <button
            disabled={!editable}
            onClick={() => {
              if (editable) h.agregarDetalle();
              onClose();
            }}
            className="flex-1 bg-cyan-400 text-black font-bold py-3 rounded-xl"
          >
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
}