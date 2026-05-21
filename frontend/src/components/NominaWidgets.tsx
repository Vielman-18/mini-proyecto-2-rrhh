export const quetzal = (v: any) =>
  `Q${Number(v || 0).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`;

const inputS =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none transition-all placeholder:text-slate-600 text-sm";

export function ModalPeriodo({ isOpen, onClose, h }: any) {
  if (!isOpen) return null;

  

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6">
      <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-8">
        <h2 className="text-2xl font-black mb-6">Crear Nómina</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Tipo de Período</label>
            <div className="flex gap-3">
              <button
                onClick={() => h.setTipoPeriodo('mensual')}
                className={`flex-1 py-3 rounded-xl font-black transition ${
                  h.tipoPeriodo === 'mensual'
                    ? 'bg-cyan-400 text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Mensual
              </button>
              <button
                onClick={() => h.setTipoPeriodo('quincenal')}
                className={`flex-1 py-3 rounded-xl font-black transition ${
                  h.tipoPeriodo === 'quincenal'
                    ? 'bg-cyan-400 text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Quincenal
              </button>
            </div>
          </div>

          <input
            className={inputS}
            placeholder="Periodo (ej: 2026-05)"
            value={h.periodo}
            onChange={(e) => h.setPeriodo(e.target.value)}
          />

          <input
            type="date"
            className={inputS}
            value={h.fechaInicio}
            onChange={(e) => h.setFechaInicio(e.target.value)}
          />

          <input
            type="date"
            className={inputS}
            value={h.fechaFin}
            onChange={(e) => h.setFechaFin(e.target.value)}
          />

          <button
            onClick={() => {
              h.crearNomina();
              onClose();
            }}
            className="w-full py-3 bg-cyan-400 text-black font-black rounded-xl"
          >
            CREAR
          </button>

          <button onClick={onClose} className="text-xs text-slate-400 w-full">
            Cerrar
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
          onClick={() => h.eliminarEmpleadoDeNomina(detalle.empleados.id)}
          className="
            flex-1
            py-3
            rounded-2xl
            bg-red-500
            hover:bg-red-400
            transition
            text-black
            font-black
          "
        >
          Quitar de nómina
        </button>

          <button
            onClick={onClose}
            className="
              flex-1
              py-3
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
                className={inputS}
                placeholder="0"
                value={h.horasExtra}
                onChange={(e) =>
                  h.setHorasExtra(Number(e.target.value))
                }
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Bonificaciones
              </label>

              <input
                type="number"
                className={inputS}
                placeholder="0"
                value={h.bonificaciones}
                onChange={(e) =>
                  h.setBonificaciones(Number(e.target.value))
                }
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Comisiones
              </label>

              <input
                type="number"
                className={inputS}
                placeholder="0"
                value={h.comisiones}
                onChange={(e) =>
                  h.setComisiones(Number(e.target.value))
                }
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
              className={inputS}
              placeholder="0"
              value={h.descuentosLegales}
              onChange={(e) =>
                h.setDescuentosLegales(Number(e.target.value))
              }
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
                h.agregarDetalle();
                onClose();
              }}
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
              Guardar
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}