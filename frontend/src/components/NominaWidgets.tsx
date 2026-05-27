import React from 'react';


export const quetzal = (v: any) =>
  `Q${Number(v || 0).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`;

const inputS =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none transition-all placeholder:text-slate-600 text-sm";


/**
 * MODAL DE CONFIRMACIÓN (NUEVO)
 * Para acciones de agregar empleados masivamente
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
 * MODAL PARA CREAR NÓMINA (PERIODO)
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
      <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="mb-6">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Crear Nómina</h2>
          <p className="text-slate-400 text-sm font-medium">Selecciona el periodo de cálculo para iniciar</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {['mensual', 'quincenal'].map((tipo) => (
            <button
              key={tipo}
              onClick={() => h.setTipoPeriodo(tipo)}
              className={`py-4 rounded-2xl font-black transition-all capitalize ${
                h.tipoPeriodo === tipo 
                  ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]' 
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              {tipo}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Mes</label>
            <select className={inputS} value={h.mes} onChange={(e) => h.setMes(e.target.value)}>
              {mesesFiltrados.map((m) => <option key={m} value={m} className="bg-slate-900">{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Año</label>
            <select className={inputS} value={h.anio} onChange={(e) => h.setAnio(e.target.value)}>
              {años.map((a) => <option key={a} value={a} className="bg-slate-900">{a}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-cyan-400/10 border border-cyan-400/20 rounded-2xl p-4 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-cyan-400 text-xs">ℹ</span>
            <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">Configuración Detectada</p>
          </div>
          <p className="text-white/90 text-sm leading-snug">
            {h.tipoPeriodo === 'quincenal' 
              ? `Se generarán automáticamente la **Q1** y **Q2** de ${h.mes}.`
              : `Se generará la nómina mensual completa para ${h.mes} ${h.anio}.`}
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition">Cancelar</button>
          <button
            onClick={async () => { const ok = await h.crearNomina(); if (ok) onClose(); }}
            className="flex-1 py-4 rounded-2xl bg-cyan-400 text-black font-black hover:bg-cyan-300 transition active:scale-95"
          >
            Generar Ahora
          </button>
        </div>
      </div>
    </div>
  );
}


export function ModalDetalleEmpleado({ isOpen, onClose, detalle, h }: any) {
  if (!isOpen || !detalle) return null;

  const CardInfo = ({ label, value, color = "text-white" }: any) => (
    <div className="bg-[#05070a] border border-white/5 rounded-2xl p-4">
      <p className="text-slate-500 text-xs font-bold uppercase mb-1">{label}</p>
      <h3 className={`font-bold text-lg ${color}`}>{value}</h3>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-[#0b1017] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300">
        
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/5">
          <div>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Detalle de Pago</h2>
            <p className="text-cyan-400 text-sm font-bold">#{detalle.empleados?.id} — {detalle.empleados?.nombres} {detalle.empleados?.apellidos}</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all text-slate-400 text-xl font-light">✕</button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardInfo label="Salario Base" value={quetzal(detalle.salario_base)} color="text-cyan-400" />
          <CardInfo label="Bonificaciones" value={quetzal(detalle.bonificaciones)} color="text-emerald-400" />
          <CardInfo label="Comisiones" value={quetzal(detalle.comisiones)} color="text-emerald-400" />
          <CardInfo label="Deducciones" value={quetzal(detalle.deducciones)} color="text-rose-400" />
          
          <div className="bg-cyan-400/10 border border-cyan-400/20 rounded-3xl p-6 md:col-span-2 mt-2 flex justify-between items-center">
            <div>
              <p className="text-cyan-300 text-xs font-black uppercase tracking-widest mb-1">Total Salario Líquido</p>
              <h3 className="text-4xl font-black text-cyan-400 tracking-tighter">{quetzal(detalle.salario_final)}</h3>
            </div>
            <div className="text-4xl opacity-20">💰</div>
          </div>
        </div>

        <div className="px-8 pb-8 flex gap-3">
          <button onClick={() => h.generarPdfEmpleado(detalle.id)} className="flex-[2] py-4 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-black font-black transition active:scale-95 shadow-lg">Descargar Recibo</button>
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-white text-black font-black hover:bg-slate-200 transition active:scale-95">Cerrar</button>
        </div>
      </div>
    </div>
  );
}


export function DrawerEmpleado({ isOpen, onClose, h }: any) {
  if (!isOpen) return null;

  const empleado = h.empleados.find((e: any) => String(e.id) === h.empleadoId);
  const editable = h.estadoActual === 'activa';

  const InputField = ({ label, value, onChange, type = "number" }: any) => (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">{label}</label>
      <input
        type={type}
        className={`${inputS} ${!editable ? 'opacity-50 cursor-not-allowed' : ''}`}
        placeholder="0.00"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={!editable}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-[520px] bg-[#0b1017] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        
        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Añadir Empleado</h2>
            <p className="text-slate-500 text-sm font-medium">Asignación individual a nómina</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition text-2xl">✕</button>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Seleccionar Colaborador</label>
            <select className={inputS} value={h.empleadoId} onChange={(e) => h.setEmpleadoId(e.target.value)}>
              <option value="">Selecciona un empleado</option>
              {h.empleados.map((e: any) => (
                <option key={e.id} value={e.id} className="bg-slate-900">{e.nombres} {e.apellidos}</option>
              ))}
            </select>
          </div>

          {empleado && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
              <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Sueldo Base</span>
              <h3 className="text-2xl font-black text-cyan-400">{quetzal(empleado.salario)}</h3>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Horas Extra" value={h.horasExtra} onChange={h.setHorasExtra} />
            <InputField label="Bonificaciones" value={h.bonificaciones} onChange={h.setBonificaciones} />
            <InputField label="Comisiones" value={h.comisiones} onChange={h.setComisiones} />
            <InputField label="Descuentos" value={h.descuentosLegales} onChange={h.setDescuentosLegales} />
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition">Cerrar</button>
            <button
              onClick={() => { if (editable) { h.agregarDetalle(); onClose(); } }}
              disabled={!editable}
              className="flex-[2] py-4 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-black font-black transition disabled:opacity-30 active:scale-95 shadow-lg"
            >
              Guardar en Nómina
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}