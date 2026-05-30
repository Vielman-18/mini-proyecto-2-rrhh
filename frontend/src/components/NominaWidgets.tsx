import React from 'react';
import { useNomina } from '../hooks/NominaLogic';
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
    const h = useNomina();

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
      deducciones: Number(detalle.descuentos_legales ?? 0) 
    });
    setEditMode(false);
  }, [detalle]);

  const setField = (field: string, value: number) => {
    setForm(prev => ({
      ...prev,
      [field]: isNaN(value) ? 0 : value
    }));
  };

 
  const IGSS_RATE = 0.0483;
  const salarioBase = Number(detalle.salario_base || 0);
  
  const IGSS = salarioBase * IGSS_RATE;
  const BONO_BASE = 250;

  const bonificacionesTotal = BONO_BASE + Number(form.bonificaciones);
  const totalDeducciones = IGSS + Number(form.deducciones);

  const guardar = async () => {
    if (!isEditable) return;
    
    const payload = {
      horas_extra: Number(form.horas_extra),
      bonificaciones: Number(form.bonificaciones),
      comisiones: Number(form.comisiones),
      descuentos_legales: Number(form.deducciones) // Enviamos como descuentos_legales
    };

    const ok = await h.actualizarEmpleadoNomina(detalle.id, payload);
    
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
      <div className="w-full max-w-2xl bg-[#0b1017] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-white/5">
          <div>
            <h2 className="text-xl font-black text-white">Detalle de Pago</h2>
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider">
              {detalle.empleados?.nombres} {detalle.empleados?.apellidos}
            </p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors text-2xl">×</button>
        </div>

        {/* BODY */}
        <div className="p-5">
          {!editMode ? (
            <div className="grid grid-cols-2 gap-3">
              <Card label="Salario Base" value={quetzal(salarioBase)} color="text-cyan-400" />
              <Card label="Horas Extra" value={form.horas_extra} color="text-white" />
              <Card label="IGSS (4.83%)" value={quetzal(IGSS)} color="text-yellow-400" />
              <Card label="Otras Deducciones" value={quetzal(form.deducciones)} color="text-rose-400" />
              
              <div className="col-span-2 bg-cyan-400/10 border border-cyan-400/20 rounded-xl p-4 mt-2">
                <p className="text-cyan-300 text-[10px] font-bold uppercase">Bonificación Total (+Ley Q250)</p>
                <p className="text-xl font-black text-cyan-400">{quetzal(bonificacionesTotal)}</p>
              </div>

              <div className="col-span-2 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-300 text-[10px] font-bold uppercase">Total Deducciones (IGSS + Otros)</p>
                <p className="text-xl font-black text-red-400">{quetzal(totalDeducciones)}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {/* Edición de Valores */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Horas Extra (Cantidad)</label>
                <input type="number" className={inputS} value={form.horas_extra} onChange={(e) => setField("horas_extra", Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Bonif. Extra</label>
                <input type="number" className={inputS} value={form.bonificaciones} onChange={(e) => setField("bonificaciones", Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Comisiones</label>
                <input type="number" className={inputS} value={form.comisiones} onChange={(e) => setField("comisiones", Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-rose-400 font-bold uppercase ml-1">Otras Deducciones</label>
                <input type="number" className={`${inputS} border-rose-500/30`} value={form.deducciones} onChange={(e) => setField("deducciones", Number(e.target.value))} />
              </div>

              <div className="col-span-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mt-2">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-red-300 font-bold uppercase">Previsualización de Descuentos</p>
                  <p className="text-lg font-black text-red-400">{quetzal(totalDeducciones)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-5 pb-6 pt-2 flex gap-3">
          {isEditable && (
            !editMode ? (
              <button onClick={() => setEditMode(true)} className="flex-1 py-3 bg-cyan-400 hover:bg-cyan-500 text-black font-black rounded-xl transition-colors">
                MODIFICAR VALORES
              </button>
            ) : (
              <>
                <button onClick={() => setEditMode(false)} className="flex-1 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10">
                  CANCELAR
                </button>
                <button onClick={guardar} className="flex-1 py-3 bg-emerald-400 hover:bg-emerald-500 text-black font-black rounded-xl">
                  GUARDAR CAMBIOS
                </button>
              </>
            )
          )}
          <button onClick={onClose} className="px-6 py-3 bg-white text-black font-black rounded-xl hover:bg-slate-200">
            CERRAR
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
            {empleado ? `${empleado.nombres} ${empleado.apellidos}` : 'Empleado'}
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

/**
 * PANEL DETALLES NÓMINA
 */
export function PanelDetallesNomina({ isOpen, onClose, nomina, detalles }: any) {
  if (!isOpen || !nomina) return null;

  const h = useNomina();

  const totalEmpleados = detalles.filter((d: any) => d.periodo === nomina.periodo).length;
  const totalPagar = detalles
    .filter((d: any) => d.periodo === nomina.periodo)
    .reduce((acc: number, d: any) => acc + Number(d.totalPagar || 0), 0);
  const totalBonificaciones = detalles
    .filter((d: any) => d.periodo === nomina.periodo)
    .reduce((acc: number, d: any) => acc + Number(d.bonificaciones || 0), 0);
  const totalDeducciones = detalles
    .filter((d: any) => d.periodo === nomina.periodo)
    .reduce((acc: number, d: any) => acc + Number(d.deducciones || 0), 0);

  const descargarVoucher = (empleadoId: number) => {
    if (!nomina?.id || !empleadoId) {
      console.error('Voucher URL missing nominaId or empleadoId', nomina, empleadoId);
      return;
    }

    try {
      window.open(`http://localhost:3000/nomina/${nomina.id}/empleado/${empleadoId}/voucher`, '_blank');
    } catch (error) {
      console.error(error);
    }
  };

  const InfoCard = ({ label, value, color }: any) => (
    <div className="bg-slate-950 border border-slate-700 rounded-lg p-3">
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
      <p className={`text-lg font-black mt-1 ${color}`}>{value}</p>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 z-[250] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-4xl bg-slate-900 border border-blue-500/20 rounded-2xl overflow-hidden shadow-2xl my-8">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 px-6 py-4 border-b border-blue-500/20 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-white">Detalles de Nómina</h2>
            <p className="text-cyan-400 text-xs font-semibold mt-1">{nomina.periodo} • {nomina.tipo_periodo}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/50 hover:text-white transition-colors text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          
          {/* INFO GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <InfoCard 
              label="Total Empleados" 
              value={totalEmpleados}
              color="text-blue-400"
            />
            <InfoCard 
              label="Total a Pagar"
              value={quetzal(totalPagar)}
              color="text-emerald-400"
            />
            <InfoCard 
              label="Bonificaciones"
              value={quetzal(totalBonificaciones)}
              color="text-yellow-400"
            />
            <InfoCard 
              label="Deducciones"
              value={quetzal(totalDeducciones)}
              color="text-rose-400"
            />
          </div>

          {/* DETALLES ADICIONALES */}
          <div className="bg-slate-950 border border-slate-700 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-bold text-white mb-3">Período</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Inicio</p>
                <p className="text-white text-xs font-semibold mt-1">
                  {new Date(nomina.fecha_inicio).toLocaleDateString('es-GT')}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fin</p>
                <p className="text-white text-xs font-semibold mt-1">
                  {new Date(nomina.fecha_fin).toLocaleDateString('es-GT')}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Creación</p>
                <p className="text-white text-xs font-semibold mt-1">
                  {new Date(nomina.fecha_creacion).toLocaleDateString('es-GT')}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estado</p>
                <p className={`font-bold mt-1 text-xs uppercase ${
                  nomina.estado?.toLowerCase() === 'procesada' ? 'text-emerald-400' :
                  nomina.estado?.toLowerCase() === 'cerrada' ? 'text-rose-400' :
                  'text-yellow-400'
                }`}>
                  {nomina.estado}
                </p>
              </div>
            </div>
          </div>

          {/* TABLA REDUCIDA DE EMPLEADOS */}
          <div className="bg-slate-950 border border-slate-700 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700">
              <h3 className="text-sm font-bold text-white">Empleados ({totalEmpleados})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-800/50">
                  <tr className="border-b border-slate-700">
                    <th className="px-3 py-2 text-left font-bold uppercase tracking-wider text-slate-300">Empleado</th>
                    <th className="px-3 py-2 text-left font-bold uppercase tracking-wider text-slate-300">Salario Base</th>
                    <th className="px-3 py-2 text-left font-bold uppercase tracking-wider text-slate-300">Bonif.</th>
                    <th className="px-3 py-2 text-left font-bold uppercase tracking-wider text-slate-300">Deducc.</th>
                    <th className="px-3 py-2 text-left font-bold uppercase tracking-wider text-slate-300">Neto</th>
                    <th className="px-3 py-2 text-center font-bold uppercase tracking-wider text-slate-300">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles
                    .filter((d: any) => d.periodo === nomina.periodo)
                    .slice(0, 15)
                    .map((detalle: any, idx: number) => {
                      console.log('PanelDetallesNomina detalle:', detalle);
                      return (
                        <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                          <td className="px-3 py-2 text-white font-semibold">
                            {detalle.nombres} {detalle.apellidos}
                          </td>
                          <td className="px-3 py-2 text-slate-300">
                            {quetzal(detalle.salarioBase)}
                          </td>
                          <td className="px-3 py-2 text-slate-300">
                            {quetzal(detalle.bonificaciones)}
                          </td>
                          <td className="px-3 py-2 text-slate-300">
                            {quetzal(detalle.deducciones)}
                          </td>
                          <td className="px-3 py-2 text-emerald-400 font-bold">
                            {quetzal(detalle.totalPagar)}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button
                              onClick={() => h.generarPdfEmpleado(detalle.detalleId)}
                              className="w-[120px] px-4 py-2 rounded-xl text-sm bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition"
                            >
                              PDF
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-slate-950 border-t border-slate-700 px-5 py-3 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}