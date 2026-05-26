export const quetzal = (v: any) =>
  `Q${Number(v || 0).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`;

const inputS =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none transition-all placeholder:text-slate-600 text-sm";

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

  const años = Array.from({ length: 5 }, (_, i) =>
    String(currentYear + i)
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6">

      <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl font-black text-white">
            Crear Nómina
          </h2>
          <p className="text-slate-400 text-sm">
            Selecciona el periodo de cálculo
          </p>
        </div>

        {/* TIPO PERIODO */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => h.setTipoPeriodo('mensual')}
            className={`py-3 rounded-xl font-black transition ${
              h.tipoPeriodo === 'mensual'
                ? 'bg-cyan-400 text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Mensual
          </button>

          <button
            onClick={() => h.setTipoPeriodo('quincenal')}
            className={`py-3 rounded-xl font-black transition ${
              h.tipoPeriodo === 'quincenal'
                ? 'bg-cyan-400 text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Quincenal
          </button>
        </div>

        {/* SELECT MES + AÑO */}
        <div className="grid grid-cols-2 gap-4 mb-4">

          {/* MES */}
          <div>
            <label className="block text-xs text-slate-400 mb-2">
              Mes
            </label>

            <select
              className={inputS}
              value={h.mes}
              onChange={(e) => h.setMes(e.target.value)}
            >
              {mesesFiltrados.map((mes) => (
                <option key={mes} value={mes}>
                  {mes}
                </option>
              ))}
            </select>
          </div>

          {/* AÑO */}
          <div>
            <label className="block text-xs text-slate-400 mb-2">
              Año
            </label>

            <select
              className={inputS}
              value={h.anio}
              onChange={(e) => h.setAnio(e.target.value)}
            >
              {años.map((anio) => (
                <option key={anio} value={anio}>
                  {anio}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* QUINCENA */}
        {h.tipoPeriodo === 'quincenal' && (
          <div className="mb-6">
            <label className="block text-xs text-slate-400 mb-2">
              Quincena
            </label>

            <select
              className={inputS}
              value={h.quincena}
              onChange={(e) =>
                h.setQuincena(e.target.value as 'Q1' | 'Q2')
              }
            >
              <option value="Q1">Primera (1 - 15)</option>
              <option value="Q2">Segunda (16 - fin)</option>
            </select>
          </div>
        )}

        {/* PREVIEW */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-6">
          <p className="text-xs text-slate-400">
            Periodo generado
          </p>

          <p className="text-sm font-bold text-white mt-1">
            {h.tipoPeriodo === 'quincenal'
              ? `${h.mes} ${h.anio} ${h.quincena}`
              : `${h.mes} ${h.anio}`}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
          >
            Cancelar
          </button>

          <button
            onClick={async () => {
              const ok = await h.crearNomina();
              if (ok) onClose();
            }}
            className="flex-1 py-3 rounded-xl bg-cyan-400 text-black font-black hover:bg-cyan-300 transition"
          >
            Crear
          </button>
        </div>

      </div>
    </div>
  );
}

export function ModalDetalleEmpleado({
  isOpen,
  onClose,
  detalle,
  h,
}: any) {
  if (!isOpen || !detalle) return null;

  return (
    <div
      className="
        fixed inset-0 z-[200]
        flex items-center justify-center
        bg-black/70 backdrop-blur-sm
        p-4
      "
    >
      <div
        className="
          w-full max-w-2xl
          bg-[#0b1017]
          border border-white/10
          rounded-3xl
          overflow-hidden
        "
      >
        {/* HEADER */}
        <div
          className="
            flex items-center justify-between
            px-6 py-5
            border-b border-white/10
          "
        >
          <div>
            <h2 className="text-2xl font-black text-white">
              Detalle de Pago
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Información completa del empleado
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              w-10 h-10
              rounded-xl
              bg-white/5
              hover:bg-white/10
              transition
              text-slate-300
              font-bold
            "
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="bg-[#05070a] rounded-2xl p-4">
            <p className="text-slate-400 text-sm">Empleado</p>

            <h3 className="font-bold mt-1">
              {detalle.empleados?.nombres}{' '}
              {detalle.empleados?.apellidos}
            </h3>
          </div>

          <div className="bg-[#05070a] rounded-2xl p-4">
            <p className="text-slate-400 text-sm">ID Empleado</p>

            <h3 className="font-bold mt-1">
              #{detalle.empleados?.id}
            </h3>
          </div>

          <div className="bg-[#05070a] rounded-2xl p-4">
            <p className="text-slate-400 text-sm">Salario Base</p>

            <h3 className="font-bold mt-1 text-cyan-400">
              {quetzal(detalle.salario_base)}
            </h3>
          </div>

          <div className="bg-[#05070a] rounded-2xl p-4">
            <p className="text-slate-400 text-sm">
              Horas No Trabajadas
            </p>

            <h3 className="font-bold mt-1">
              {detalle.horas_trabajadas}
            </h3>
          </div>

          <div className="bg-[#05070a] rounded-2xl p-4">
            <p className="text-slate-400 text-sm">Horas Extra</p>

            <h3 className="font-bold mt-1">
              {detalle.horas_extra}
            </h3>
          </div>

          <div className="bg-[#05070a] rounded-2xl p-4">
            <p className="text-slate-400 text-sm">
              Bonificaciones
            </p>

            <h3 className="font-bold mt-1 text-emerald-400">
              {quetzal(detalle.bonificaciones)}
            </h3>
          </div>

          <div className="bg-[#05070a] rounded-2xl p-4">
            <p className="text-slate-400 text-sm">
              Comisiones
            </p>

            <h3 className="font-bold mt-1 text-emerald-400">
              {quetzal(detalle.comisiones)}
            </h3>
          </div>

          <div className="bg-[#05070a] rounded-2xl p-4">
            <p className="text-slate-400 text-sm">
              Deducciones
            </p>

            <h3 className="font-bold mt-1 text-red-400">
              {quetzal(detalle.deducciones)}
            </h3>
          </div>

          <div className="bg-[#05070a] rounded-2xl p-4">
            <p className="text-slate-400 text-sm">
              Descuentos Legales
            </p>

            <h3 className="font-bold mt-1 text-red-400">
              {quetzal(detalle.descuentos_legales)}
            </h3>
          </div>

          <div
            className="
              bg-cyan-400/10
              border border-cyan-400/20
              rounded-2xl
              p-4
            "
          >
            <p className="text-cyan-300 text-sm">
              Salario Final
            </p>

            <h3 className="text-3xl font-black text-cyan-400 mt-1">
              {quetzal(detalle.salario_final)}
            </h3>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 pb-6 flex gap-3">

          <button
            onClick={() =>
              h.generarPdfEmpleado(detalle.id)
            }
            className="
              flex-1
              py-3
              rounded-2xl
              bg-emerald-400
              hover:bg-emerald-300
              transition
              text-black
              font-black
            "
          >
            Descargar Recibo
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3
              rounded-2xl
              bg-white
              hover:bg-slate-200
              transition
              text-black
              font-black
            "
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
export function DrawerEmpleado({ isOpen, onClose, h }: any) {
  if (!isOpen) return null;

  const cerrarPanel = () => {
    const confirmar = window.confirm(
      'Si sales no se guardarán los cambios'
    );

    if (confirmar) {
      onClose();
    }
  };

  const empleado = h.empleados.find(
    (e: any) => String(e.id) === h.empleadoId
  );

  const editable = h.estadoActual === 'activa';

  return (
    <div className="
      fixed inset-0 z-[100]
      flex items-center justify-center
      bg-black/70 backdrop-blur-sm
      p-4
    ">

      <div className="
        w-full max-w-[520px]
        bg-[#0b1017]
        border border-white/10
        rounded-3xl
        overflow-hidden
        shadow-2xl
      ">

        {/* HEADER */}
        <div className="
          flex items-center justify-between
          px-6 py-5
          border-b border-white/10
        ">

          <div>
            <h2 className="text-2xl font-black text-white">
              Agregar empleado
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Completa los datos de nómina
            </p>
          </div>

          <button
            onClick={cerrarPanel}
            className="
              w-10 h-10
              rounded-xl
              bg-white/5
              hover:bg-red-500/20
              hover:text-red-400
              transition
              text-slate-300
              font-bold
            "
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">

          {/* EMPLEADO */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Empleado
            </label>

            <select
              className={inputS}
              value={h.empleadoId}
              onChange={(e) => h.setEmpleadoId(e.target.value)}
            >
              <option value="">Selecciona un empleado</option>

              {h.empleados.map((e: any) => (
                <option key={e.id} value={e.id}>
                  {e.nombres} {e.apellidos}
                </option>
              ))}
            </select>
          </div>

          {/* RESUMEN */}
          {empleado && (
            <div className="
              bg-[#05070a]
              border border-white/10
              rounded-2xl
              p-4
            ">
              <p className="text-slate-400 text-sm mb-2">
                Salario base
              </p>

              <h3 className="text-2xl font-black text-cyan-400">
                Q {Number(empleado.salario || 0).toFixed(2)}
              </h3>
            </div>
          )}

          {/* CAMPOS */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Horas extra
              </label>

              <input
                type="number"
                className={`${inputS} ${!editable ? 'opacity-60 cursor-not-allowed' : ''}`}
                placeholder="0"
                value={h.horasExtra}
                onChange={(e) =>
                  h.setHorasExtra(Number(e.target.value))
                }
                disabled={!editable}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Bonificaciones
              </label>

              <input
                type="number"
                className={`${inputS} ${!editable ? 'opacity-60 cursor-not-allowed' : ''}`}
                placeholder="0"
                value={h.bonificaciones}
                onChange={(e) =>
                  h.setBonificaciones(Number(e.target.value))
                }
                disabled={!editable}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Comisiones
              </label>

              <input
                type="number"
                className={`${inputS} ${!editable ? 'opacity-60 cursor-not-allowed' : ''}`}
                placeholder="0"
                value={h.comisiones}
                onChange={(e) =>
                  h.setComisiones(Number(e.target.value))
                }
                disabled={!editable}
              />
            </div>
          </div>

          {/* DESCUENTOS */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Descuentos legales
            </label>

            <input
              type="number"
              className={`${inputS} ${!editable ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0"
              value={h.descuentosLegales}
              onChange={(e) =>
                h.setDescuentosLegales(Number(e.target.value))
              }
              disabled={!editable}
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-2">

            <button
              onClick={cerrarPanel}
              className="
                flex-1
                py-3
                rounded-2xl
                bg-white/5
                hover:bg-white/10
                transition
                font-bold
              "
            >
              Cancelar
            </button>

            <button
              onClick={() => {
                if (editable) {
                  h.agregarDetalle();
                  onClose();
                }
              }}
              disabled={!editable}
              className={`
                flex-1
                py-3
                rounded-2xl
                bg-emerald-400
                hover:bg-emerald-300
                transition
                text-black
                font-black
                ${!editable ? 'opacity-60 cursor-not-allowed' : ''}
              `}
            >
              Guardar
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}