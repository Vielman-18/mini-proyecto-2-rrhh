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

  const initialForm = {
    horas_extra: 0,
    bonificaciones: 0,
    comisiones: 0,
    deducciones: 0
  };

  const [editMode, setEditMode] = React.useState(false);
  const [form, setForm] = React.useState(initialForm);

  React.useEffect(() => {
    if (!detalle) return;

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

  const guardar = async () => {
    if (!isEditable) return;

    const success = await h.actualizarEmpleadoNomina(detalle.id, form);

    if (success) {
      setEditMode(false);
      onClose();
    }
  };

  const Card = ({ label, value, color }: any) => (
    <div className="bg-[#05070a] border border-white/5 rounded-2xl p-4">
      <p className="text-slate-500 text-xs font-bold uppercase">{label}</p>
      <p className={`text-lg font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">

      <div className="w-full max-w-2xl bg-[#0b1017] border border-white/10 rounded-[2.5rem] overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-white/5">
          <div>
            <h2 className="text-2xl font-black text-white">
              Detalle de Pago
            </h2>
            <p className="text-cyan-400 text-sm font-bold">
              {detalle.empleados?.nombres} {detalle.empleados?.apellidos}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white text-xl hover:text-red-400"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-8">

          {!editMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Card
                label="Salario Base"
                value={quetzal(detalle.salario_base)}
                color="text-cyan-400"
              />

              <Card
                label="Bonificaciones"
                value={quetzal(detalle.bonificaciones)}
                color="text-emerald-400"
              />

              <Card
                label="Comisiones"
                value={quetzal(detalle.comisiones)}
                color="text-emerald-400"
              />

              <Card
                label="Deducciones"
                value={quetzal(detalle.deducciones)}
                color="text-rose-400"
              />

              <div className="md:col-span-2 bg-cyan-400/10 border border-cyan-400/20 rounded-2xl p-5">
                <p className="text-cyan-300 text-xs font-bold uppercase">
                  Total Líquido
                </p>
                <h3 className="text-3xl font-black text-cyan-400">
                  {quetzal(detalle.salario_final)}
                </h3>
              </div>

            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">

              {[
                { key: 'horas_extra', label: 'Horas Extra' },
                { key: 'bonificaciones', label: 'Bonificaciones' },
                { key: 'comisiones', label: 'Comisiones' },
                { key: 'deducciones', label: 'Deducciones' }
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs text-slate-500 font-bold uppercase">
                    {f.label}
                  </label>

                  <input
                    type="number"
                    min={0}
                    className={inputS}
                    value={(form as any)[f.key]}
                    onChange={(e) =>
                      setField(f.key, Number(e.target.value))
                    }
                  />
                </div>
              ))}

            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="px-8 pb-8 flex gap-3">

          {isEditable && (
            !editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex-1 py-4 bg-cyan-400 text-black font-black rounded-2xl"
              >
                Modificar
              </button>
            ) : (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 py-4 bg-white/10 text-white font-bold rounded-2xl"
                >
                  Cancelar
                </button>

                <button
                  onClick={guardar}
                  className="flex-1 py-4 bg-emerald-400 text-black font-black rounded-2xl"
                >
                  Guardar
                </button>
              </>
            )
          )}

          <button
            onClick={onClose}
            className="flex-1 py-4 bg-white text-black font-black rounded-2xl"
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