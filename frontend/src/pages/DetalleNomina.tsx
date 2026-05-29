import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useNomina } from '../hooks/NominaLogic';

import HistorialNominaModal from './Historial';

import {
  DrawerEmpleado,
  quetzal,
  ModalDetalleEmpleado,
  ModalConfirmacionAction
} from '../components/NominaWidgets';

export default function DetalleNomina() {

  const { id } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  const h = useNomina();

  const [detalleOpen, setDetalleOpen] = useState(false);

  const [detalle, setDetalle] = useState<any>(null);

  const [historialOpen, setHistorialOpen] =
    useState(false);

  const [detalleSeleccionado, setDetalleSeleccionado] =
    useState<number | undefined>();

  const [dOpen, setDOpen] = useState(false);

  const [showDeptPanel, setShowDeptPanel] =
    useState(false);

  const [showPuestoPanel, setShowPuestoPanel] =
    useState(false);

  useEffect(() => {

    if (!id) return;

    h.setNominaId(id);

    const estado = location.state?.estado || 'activa';

    h.setEstadoActual(estado);

    h.cargarDetalles(id);

  }, [id]);

  const normalizeEstado = (estado: string) => {
    const raw = String(estado || '').trim().toLowerCase();

    if (
      !raw ||
      raw === 'abierta' ||
      raw === 'activo'
    ) {
      return 'activa';
    }

    if (raw === 'inactiva') {
      return 'procesada';
    }

    return raw;
  };

  const estadoActualNormalizado =
    normalizeEstado(h.estadoActual);

  const isNominaEditable =
    estadoActualNormalizado === 'activa';

  const isNominaCerrada =
    estadoActualNormalizado === 'cerrada';

  const estadoOptions =
    estadoActualNormalizado === 'activa'
      ? [
          {
            value: 'activa',
            label: 'Activa'
          },
          {
            value: 'cerrada',
            label: 'Cerrada'
          },
        ]
      : estadoActualNormalizado === 'cerrada'
      ? [
          {
            value: 'activa',
            label: 'Activa'
          },
          {
            value: 'cerrada',
            label: 'Cerrada'
          },
          {
            value: 'procesada',
            label: 'Procesada'
          },
        ]
      : [
          {
            value: 'procesada',
            label: 'Procesada'
          },
        ];


return (
  <div className="min-h-screen bg-[#05070a] text-white px-4 md:px-8 py-6">

    <div className="max-w-7xl mx-auto bg-[#0b1017] border border-white/10 rounded-[32px] p-5 md:p-8">

      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8 mb-10">

        {/* INFO */}
        <div className="space-y-5">

          <button
            onClick={() => navigate('/rrhh/nomina')}
            className="text-cyan-400 hover:text-cyan-300 transition flex items-center gap-2 text-sm font-semibold"
          >
            <span>←</span>
            Volver
          </button>

          <div>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Nómina #{h.nominaId}
            </h2>

            <p className="text-slate-400 mt-2 text-sm md:text-base">
              Gestión de colaboradores y pagos
            </p>

          </div>

          {/* ESTADO */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">

            <label className="text-slate-400 text-sm font-semibold">
              Estado:
            </label>

            <select
              value={estadoActualNormalizado}
              onChange={(e) =>
                h.cambiarEstado(e.target.value)
              }
              disabled={
                h.loading ||
                estadoActualNormalizado === 'procesada'
              }
              className="bg-[#05070a] border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-cyan-400 min-w-[220px]"
            >

              {estadoOptions.map((opt) => (

                <option
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.label}
                </option>

              ))}

            </select>

          </div>

          {isNominaCerrada && (
            <div className="mt-4 rounded-2xl bg-amber-500/10 border border-amber-400/20 p-4 text-sm text-amber-100">
              Esta nómina está cerrada. Cambia el estado a <strong>Activa</strong> para poder agregar empleados.
            </div>
          )}

        </div>

        {/* ACCIONES */}
        <div className="flex flex-wrap gap-3 xl:max-w-[520px]">

          <button
            onClick={h.agregarTodosEmpleados}
            disabled={!isNominaEditable || h.loading}
            className="flex-1 min-w-[180px] px-6 py-4 bg-white hover:bg-slate-200 transition text-black font-black rounded-2xl disabled:opacity-50"
          >
            Agregar todos
          </button>

          {/* DEPARTAMENTO */}
          <div className="relative flex-1 min-w-[180px]">

            <button
              onClick={() =>
                setShowDeptPanel(!showDeptPanel)
              }
              disabled={!isNominaEditable || h.loading}
              className={`w-full px-6 py-4 transition font-black rounded-2xl border ${
                showDeptPanel
                  ? 'bg-cyan-400 text-black'
                  : 'bg-[#05070a] text-white border-white/10'
              }`}
            >
              Por departamento
            </button>

            {showDeptPanel && (

              <div className="absolute top-full right-0 mt-3 w-full bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden">

                {h.departamentos.map((d: any) => (

                  <button
                    key={d.id}
                    onClick={() => {

                      h.agregarEmpleadosPorDepartamento(
                        Number(d.id)
                      );

                      setShowDeptPanel(false);
                    }}
                    className="w-full text-left px-5 py-4 hover:bg-cyan-400 hover:text-black transition text-sm font-bold border-b border-white/5"
                  >
                    {d.nombre}
                  </button>

                ))}

              </div>

            )}

          </div>

          {/* PUESTO */}
          <div className="relative flex-1 min-w-[180px]">

            <button
              onClick={() =>
                setShowPuestoPanel(!showPuestoPanel)
              }
              disabled={!isNominaEditable || h.loading}
              className={`w-full px-6 py-4 transition font-black rounded-2xl border ${
                showPuestoPanel
                  ? 'bg-cyan-400 text-black'
                  : 'bg-[#05070a] text-white border-white/10'
              }`}
            >
              Por puesto
            </button>

            {showPuestoPanel && (

              <div className="absolute top-full right-0 mt-3 w-full bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden">

                {h.puestos.map((p: any) => (

                  <button
                    key={p.id}
                    onClick={() => {

                      h.agregarEmpleadosPorPuesto(
                        Number(p.id)
                      );

                      setShowPuestoPanel(false);
                    }}
                    className="w-full text-left px-5 py-4 hover:bg-cyan-400 hover:text-black transition text-sm font-bold border-b border-white/5"
                  >
                    {p.nombre}
                  </button>

                ))}

              </div>

            )}

          </div>

        </div>

      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

        <div className="bg-[#05070a] border border-white/10 rounded-3xl p-6">

          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
            Colaboradores
          </p>

          <p className="text-4xl font-black mt-3">
            {h.resumen.empleados}
          </p>

        </div>

        <div className="bg-[#05070a] border border-white/10 rounded-3xl p-6">

          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
            Total a pagar
          </p>

          <p className="text-4xl font-black mt-3 text-cyan-400 break-words">
            {quetzal(h.resumen.total)}
          </p>

        </div>

        <div className="bg-[#05070a] border border-white/10 rounded-3xl p-6">

          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
            Estado
          </p>

          <p className="text-2xl font-black mt-3 uppercase">
            {estadoActualNormalizado}
          </p>

        </div>

      </div>

      {/* HEADER TABLA */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6">

        <div>

          <h3 className="text-2xl font-black">
            Detalle de Pagos
          </h3>

          <p className="text-slate-500 text-sm mt-1">
            Empleados agregados a esta nómina
          </p>

        </div>

        <button
          onClick={h.generarPdf}
          disabled={h.loading || !h.nominaId}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-7 py-3 rounded-2xl transition disabled:opacity-50"
        >
          Exportar PDF
        </button>

      </div>

      {/* TABLA */}
      <div className="overflow-x-auto border border-white/5 rounded-3xl">

        <table className="w-full min-w-[1100px] text-left">

          <thead className="bg-white/[0.03] text-slate-400 text-xs uppercase">

            <tr>

              <th className="px-6 py-5">
                Empleado
              </th>

              <th className="py-5">
                Salario Base
              </th>

              <th className="py-5">
                Extras
              </th>

              <th className="py-5">
                Deducciones
              </th>

              <th className="py-5">
                Total
              </th>

              <th className="py-5 px-6 text-right">
                Acciones
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-white/5">

            {h.detallesProcesados.map((d: any) => (

              <tr
                key={d.id}
                className="hover:bg-white/[0.03] transition"
              >

                {/* EMPLEADO */}
                <td className="px-6 py-6">

                  <button
                    onClick={() => {

                      setDetalle(d);

                      setDetalleOpen(true);
                    }}
                    className="text-cyan-400 hover:text-cyan-300 transition"
                  >

                    <div className="font-black text-base">
                      {d.empleados?.nombres}
                    </div>

                    <div className="text-sm text-slate-500 mt-1">
                      {d.empleados?.apellidos}
                    </div>

                  </button>

                </td>

                {/* SALARIO */}
                <td className="py-6 font-semibold text-base">
                  {quetzal(d.salario_base)}
                </td>

                {/* EXTRAS */}
                <td className="py-6">

                  <div className="text-emerald-400 font-black text-lg">
                    {quetzal(d.total_extras)}
                  </div>

                  <div className="text-xs text-slate-500 mt-1">
                    Bonos y extras
                  </div>

                </td>

                {/* DEDUCCIONES */}
                <td className="py-6">

                  <div className="text-red-400 font-black text-lg">
                    {quetzal(d.deducciones)}
                  </div>

                  <div className="text-xs text-slate-500 mt-1">
                    IGSS y descuentos
                  </div>

                </td>

                {/* TOTAL */}
                <td className="py-6">

                  <div className="text-cyan-400 font-black text-2xl">
                    {quetzal(d.salario_final)}
                  </div>

                </td>

                {/* ACCIONES */}
                <td className="py-6 px-6">

                  <div className="flex flex-col gap-2 items-end">

                    <button
                      onClick={() =>
                        h.generarPdfEmpleado(d.id)
                      }
                      className="w-[120px] px-4 py-2 rounded-xl text-sm bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition"
                    >
                      PDF
                    </button>

                    <button
                      onClick={() =>
                        h.solicitarEliminarEmpleado(
                          d.empleado_id
                        )
                      }
                      disabled={
                        !isNominaEditable ||
                        h.loading
                      }
                      className="w-[120px] px-4 py-2 rounded-xl text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 transition disabled:opacity-40"
                    >
                      Remover
                    </button>

                    <button
                      onClick={() => {

                        setDetalleSeleccionado(d.id);

                        setHistorialOpen(true);
                      }}
                      className="w-[120px] px-4 py-2 rounded-xl text-sm bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20 transition"
                    >
                      Historial
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {h.detallesProcesados.length === 0 && (

          <div className="text-center py-24 text-slate-600 text-lg">
            No hay empleados vinculados a esta nómina
          </div>

        )}

      </div>

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

      <HistorialNominaModal
        isOpen={historialOpen}
        onClose={() => setHistorialOpen(false)}
        detalleId={detalleSeleccionado}
      />

    </div>
  </div>
);


}