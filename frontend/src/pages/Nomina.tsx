import { useState } from 'react';
import { useNomina } from '../hooks/NominaLogic';
import HistorialNominaModal from './Historial';
import {
  ModalPeriodo,
  DrawerEmpleado,
  quetzal,
  ModalDetalleEmpleado,
  ModalConfirmacionAction
} from '../components/NominaWidgets';

export default function Nomina() {

  const [historialOpen, setHistorialOpen] =
  useState(false);

const [detalleSeleccionado, setDetalleSeleccionado] =
  useState<number | undefined>();
  const h = useNomina();
  const [mOpen, setMOpen] = useState(false);
  const [dOpen, setDOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalle, setDetalle] = useState<any>(null);
  
  const [showPuestoPanel, setShowPuestoPanel] = useState(false);

  const [showDeptPanel, setShowDeptPanel] = useState(false);

  const normalizeEstado = (estado: string) => {
    if (!estado || estado === 'abierta' || estado === 'activo') return 'activa';
    if (estado === 'inactiva') return 'procesada';
    return estado;
  };

  const estadoActualNormalizado = normalizeEstado(h.estadoActual);
  const isNominaEditable = estadoActualNormalizado === 'activa';

  const estadoOptions =
    estadoActualNormalizado === 'activa'
      ? [
          { value: 'activa', label: 'Activa' },
          { value: 'cerrada', label: 'Cerrada' },
        ]
      : estadoActualNormalizado === 'cerrada'
      ? [
          { value: 'cerrada', label: 'Cerrada' },
          { value: 'procesada', label: 'Procesada' },
        ]
      : [{ value: 'procesada', label: 'Procesada' }];

  const nominasFiltradas = h.nominas.filter((n) =>
    `${n.periodo} ${n.estado} ${n.id}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black">
            {h.nominaId ? 'Detalle Nómina' : 'Nóminas'}
          </h1>
          <p className="text-slate-400 mt-2">
            Gestión de nóminas y empleados
          </p>
        </div>

        {!h.nominaId && (
          <button
            onClick={() => setMOpen(true)}
            className="px-5 py-3 bg-cyan-400 hover:bg-cyan-300 transition text-black font-black rounded-2xl"
          >
            + Crear Nómina
          </button>
        )}
      </div>

      {/* LISTADO DE NÓMINAS */}
      {!h.nominaId ? (
        <div className="bg-[#0b1017] border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <input
              type="text"
              placeholder="Buscar nómina por periodo o ID..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-400"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-slate-400 text-sm bg-white/5">
                <tr>
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Periodo</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {nominasFiltradas.map((n) => (
                  <tr key={n.id} className="border-t border-white/10 hover:bg-white/5 transition">
                    <td className="px-5 py-4 font-bold">#{n.id}</td>
                    <td className="px-5 py-4 capitalize">{n.periodo}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        n.estado === 'activa' ? 'bg-emerald-500/10 text-emerald-400' :
                        n.estado === 'cerrada' || n.estado === 'procesada' ? 'bg-amber-400/10 text-amber-400' :
                        'bg-rose-500/10 text-rose-400'
                      }`}>
                        {n.estado.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => {
                            h.setNominaId(String(n.id));
                            h.setEstadoActual(n.estado);
                            h.cargarDetalles(String(n.id));
                          }}
                          className="text-cyan-400 hover:text-cyan-300 font-semibold"
                        >
                          Gestionar
                        </button>
                        <button
                          onClick={() => h.solicitarEliminarNomina(n.id)}
                          disabled={n.estado === 'cerrada' || n.estado === 'procesada'}
                          className="text-red-500 hover:text-red-400 disabled:opacity-30 text-sm font-bold"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VISTA DETALLE DE NÓMINA SELECCIONADA */
        <div className="bg-[#0b1017] border border-white/10 rounded-3xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <button onClick={() => h.setNominaId('')} className="text-cyan-400 mb-3 hover:underline flex items-center gap-2">
                <span>←</span> Volver al listado
              </button>
              <h2 className="text-3xl font-black">Nómina #{h.nominaId}</h2>
              <div className="mt-4 flex items-center gap-3">
                <label className="text-slate-400 text-sm">Cambiar Estado:</label>
                <select
                  value={estadoActualNormalizado}
                  onChange={(e) => h.cambiarEstado(e.target.value)}
                  disabled={h.loading || estadoActualNormalizado === 'procesada'}
                  className="bg-[#05070a] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                >
                  {estadoOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ACCIONES DE AGREGADO (Panel Refactorizado) */}
           <div className="flex flex-col sm:flex-row gap-3 items-stretch relative">

  <button
    onClick={h.agregarTodosEmpleados}
    disabled={!isNominaEditable || h.loading}
    className="px-6 py-3 bg-white hover:bg-slate-200 transition text-black font-black rounded-2xl disabled:opacity-50 flex items-center justify-center gap-2"
  >
    Agregar todos
  </button>

  {/* POR DEPARTAMENTO */}
  <div className="relative">
    <button
      onClick={() => setShowDeptPanel(!showDeptPanel)}
      disabled={!isNominaEditable || h.loading}
      className={`px-6 py-3 transition font-black rounded-2xl flex items-center justify-center gap-2 border ${
        showDeptPanel ? 'bg-cyan-400 text-black' : 'bg-[#05070a] text-white border-white/10'
      } disabled:opacity-50`}
    >
      Por departamento
      <svg className={`w-4 h-4 transition-transform ${showDeptPanel ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    {showDeptPanel && (
      <>
        <div className="fixed inset-0 z-10" onClick={() => setShowDeptPanel(false)} />
        <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden">
          <div className="p-3 bg-white/5 border-b border-white/5">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Selecciona área</p>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {h.departamentos.map((d: any) => (
              <button
                key={d.id}
                onClick={() => {
                  h.agregarEmpleadosPorDepartamento(Number(d.id));
                  setShowDeptPanel(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-cyan-400 hover:text-black transition text-sm font-bold border-b border-white/5 last:border-0"
              >
                {d.nombre}
              </button>
            ))}
          </div>
        </div>
      </>
    )}
  </div>

  {/* POR PUESTO (NUEVO) */}
  <div className="relative">
    <button
      onClick={() => setShowPuestoPanel(!showPuestoPanel)}
      disabled={!isNominaEditable || h.loading}
      className={`px-6 py-3 transition font-black rounded-2xl flex items-center justify-center gap-2 border ${
        showPuestoPanel ? 'bg-cyan-400 text-black' : 'bg-[#05070a] text-white border-white/10'
      } disabled:opacity-50`}
    >
      Por puesto
      <svg className={`w-4 h-4 transition-transform ${showPuestoPanel ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    {showPuestoPanel && (
      <>
        <div className="fixed inset-0 z-10" onClick={() => setShowPuestoPanel(false)} />
        <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden">
          <div className="p-3 bg-white/5 border-b border-white/5">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Selecciona puesto</p>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {h.puestos.map((p: any) => (
              <button
                key={p.id}
                onClick={() => {
                  h.agregarEmpleadosPorPuesto(Number(p.id));
                  setShowPuestoPanel(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-cyan-400 hover:text-black transition text-sm font-bold border-b border-white/5 last:border-0"
              >
                {p.nombre}
              </button>
            ))}
          </div>
        </div>
      </>
    )}
  </div>
     </div>
          </div>

          {/* KPIs RESUMEN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#05070a] border border-white/10 rounded-2xl p-5">
              <p className="text-slate-400 text-sm font-bold">Colaboradores</p>
              <p className="text-3xl font-black text-white">{h.resumen.empleados}</p>
            </div>
            <div className="bg-[#05070a] border border-white/10 rounded-2xl p-5">
              <p className="text-slate-400 text-sm font-bold">Total a Pagar</p>
              <p className="text-3xl font-black text-cyan-400">{quetzal(h.resumen.total)}</p>
            </div>
            <div className="bg-[#05070a] border border-white/10 rounded-2xl p-5">
              <p className="text-slate-400 text-sm font-bold">Estado Actual</p>
              <p className="text-xl font-black uppercase tracking-widest">{estadoActualNormalizado}</p>
            </div>
          </div>

          {/* ACCIÓN EXPORTAR */}
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-bold">Detalle de Pagos</h3>
             <button
               onClick={h.generarPdf}
               disabled={h.loading || !h.nominaId}
               className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-6 py-2 rounded-xl transition disabled:opacity-50"
             >
               {h.loading ? '...' : 'Exportar PDF'}
             </button>
          </div>
{/* TABLA DE DETALLES */}
<div className="overflow-x-auto">
  <table className="w-full text-left">

    <thead className="text-slate-400 text-xs uppercase bg-white/5">
      <tr>
        <th className="py-4 px-4">Empleado</th>
        <th className="py-4">Salario Base</th>
        <th className="py-4">Extras Ganados</th>
        <th className="py-4">Deducciones</th>
        <th className="py-4">Total</th>
        <th className="py-4 text-right px-4">Acciones</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-white/5">
      {h.detallesProcesados.map((d: any) => (

        <tr
          key={d.id}
          className="hover:bg-white/[0.03] transition"
        >

          {/* EMPLEADO */}
          <td className="py-4 px-4">
            <button
              onClick={() => {
                setDetalle(d);
                setDetalleOpen(true);
              }}
              className="text-cyan-400 font-bold hover:text-cyan-300 transition"
            >
              {d.empleados?.nombres} {d.empleados?.apellidos}
            </button>
          </td>

          {/* SALARIO BASE */}
          <td className="py-4">
            <span className="font-semibold text-white">
              {quetzal(d.salario_base)}
            </span>
          </td>

          {/* EXTRAS */}
          <td className="py-4">

            <div className="flex flex-col">

              <span className="font-black text-emerald-400 text-base">
                {quetzal(d.total_extras)}
              </span>

              <span className="text-[11px] text-slate-500 mt-1">
                Bono 250 + extras
              </span>

            </div>

          </td>

          {/* DEDUCCIONES */}
          <td className="py-4">

            <div className="flex flex-col">

              <span className="font-black text-red-400 text-base">
                {quetzal(d.deducciones)}
              </span>

              <span className="text-[11px] text-slate-500 mt-1">
                IGSS + deducciones
              </span>

            </div>

          </td>

          {/* TOTAL FINAL */}
          <td className="py-4">
            <span className="font-black text-cyan-400 text-lg">
              {quetzal(d.salario_final)}
            </span>
          </td>

          {/* ACCIONES */}
          <td className="py-4 text-right px-4 space-y-2">

            <button
             onClick={() => h.generarPdfEmpleado(d.id)}
              className="w-full px-3 py-1.5 rounded-xl text-sm bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition"
            >
              PDF
            </button>

            <button
              onClick={() => h.solicitarEliminarEmpleado(d.empleado_id)}
              disabled={!isNominaEditable || h.loading}
              className="w-full px-3 py-1.5 rounded-xl text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Remover
            </button>

            <button
              onClick={() => {
                setDetalleSeleccionado(d.id);
                setHistorialOpen(true);
              }}
              className="w-full px-3 py-1.5 rounded-xl text-sm bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20 transition"
            >
              Historial
            </button>

          </td>

        </tr>

      ))}
    </tbody>

  </table>

  {h.detallesProcesados.length === 0 && (
    <div className="text-center py-20 text-slate-600">
      No hay empleados vinculados a esta nómina
    </div>
  )}
</div>
</div>
)}

{/* MODALES */}
<HistorialNominaModal
  isOpen={historialOpen}
  onClose={() => setHistorialOpen(false)}
  detalleId={detalleSeleccionado}
/>

<ModalPeriodo
  isOpen={mOpen}
  onClose={() => setMOpen(false)}
  h={h}
/>

<ModalDetalleEmpleado
  isOpen={detalleOpen}
  onClose={() => setDetalleOpen(false)}
  detalle={detalle}
  h={h}
/>

<DrawerEmpleado
  isOpen={dOpen}
  onClose={() => setDOpen(false)}
  h={h}
/>

<ModalConfirmacionAction
  isOpen={h.confirmacionOpen}
  onClose={() => h.setConfirmacionOpen(false)}
  onConfirm={() => h.confirmacionAccion && h.confirmacionAccion()}
  titulo={h.confirmacionTitulo}
  mensaje={h.confirmacionMensaje}
  loading={h.loading}
/>

</div>
);
}