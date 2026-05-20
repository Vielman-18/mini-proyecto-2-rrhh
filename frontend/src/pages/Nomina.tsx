import { useState } from 'react';
import { useNomina } from '../hooks/NominaLogic';
import {
  ModalPeriodo,
  DrawerEmpleado,
  quetzal,
  ModalDetalleEmpleado
} from '../components/NominaWidgets';

export default function Nomina() {
  const h = useNomina();

  const [mOpen, setMOpen] = useState(false);
  const [dOpen, setDOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalle, setDetalle] = useState<any>(null);

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

        <button
          onClick={() => setMOpen(true)}
          className="px-5 py-3 bg-cyan-400 hover:bg-cyan-300 transition text-black font-black rounded-2xl"
        >
          + Crear Nómina
        </button>
      </div>

      {/* LISTADO */}
      {!h.nominaId ? (
        <div className="bg-[#0b1017] border border-white/10 rounded-3xl overflow-hidden">

          <div className="p-5 border-b border-white/10">
            <input
              type="text"
              placeholder="Buscar nómina..."
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
                    <td className="px-5 py-4">{n.periodo}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        n.estado === 'abierta' ? 'bg-cyan-400/10 text-cyan-400' :
                        n.estado === 'procesada' ? 'bg-yellow-400/10 text-yellow-400' :
                        'bg-red-400/10 text-red-400'
                      }`}>
                        {n.estado}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
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
                    </td>
                  </tr>
                ))}

                {!nominasFiltradas.length && (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-slate-500">
                      No hay resultados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* DETALLE */
        <div className="bg-[#0b1017] border border-white/10 rounded-3xl p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <button
                onClick={() => h.setNominaId('')}
                className="text-cyan-400 mb-3"
              >
                ← Volver
              </button>
              <h2 className="text-3xl font-black">
                Nómina #{h.nominaId}
              </h2>

              <div className="mt-4 flex items-center gap-3">
                <label className="text-slate-400 text-sm">Estado:</label>
                <select
                  value={h.estadoActual}
                  onChange={(e) => h.cambiarEstado(e.target.value)}
                  disabled={h.loading}
                  className="bg-[#05070a] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 disabled:opacity-60"
                >
                  <option value="abierta">Abierta</option>
                  <option value="procesada">Procesada</option>
                  <option value="cerrada">Cerrada</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setDOpen(true)}
              disabled={h.estadoActual === 'cerrada' || h.loading}
              className="px-5 py-3 bg-white hover:bg-slate-200 transition text-black font-black rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              + Agregar empleado
            </button>
          </div>

          <div className="mb-6 bg-[#05070a] border border-white/10 rounded-2xl p-5 flex items-center justify-between">

              <div>
                <p className="text-slate-400 text-sm mb-2">
                  Total Nómina
                </p>

                <h3 className="text-3xl font-black text-cyan-400">
                  {quetzal(h.resumen.total)}
                </h3>
              </div>

              <button
                type="button"
                onClick={h.generarPdf}
                disabled={h.loading || !h.nominaId}
                className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-black disabled:opacity-60"
              >
                {h.loading ? 'Generando...' : 'Exportar PDF'}
              </button>

            </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-slate-400 text-sm">
                <tr>
                  <th className="py-4">ID</th>
                  <th className="py-4">Empleado</th>
                  <th className="py-4">Salario Base</th>
                  <th className="py-4">Deducciones</th>
                  <th className="py-4">Salario Final</th>
                </tr>
              </thead>

              <tbody>
                {h.loading && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-400">
                      Cargando empleados...
                    </td>
                  </tr>
                )}
                {!h.loading && h.detalles.length > 0 && h.detalles.map((d) => (
                  <tr key={d.id} className="border-t border-white/10">
                    <td className="py-4">{d.id}</td>

                    <td className="py-4">
                      <button
                        onClick={() => {
                          setDetalle(d);
                          setDetalleOpen(true);
                        }}
                        className="text-cyan-400 hover:underline"
                      >
                        {d.empleados?.nombres} {d.empleados?.apellidos}
                      </button>
                    </td>

                    <td className="py-4">{quetzal(d.salario_base)}</td>
                    <td className="py-4">{quetzal(d.deducciones)}</td>
                    <td className="py-4 font-bold text-cyan-400">
                      {quetzal(d.salario_final)}
                    </td>
                  </tr>
                ))}

                {!h.loading && h.detalles.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-500">
                      No hay empleados agregados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ModalPeriodo
        isOpen={mOpen}
        onClose={() => setMOpen(false)}
        h={h}
      />

      <ModalDetalleEmpleado
        isOpen={detalleOpen}
        onClose={() => setDetalleOpen(false)}
        detalle={detalle}
      />

      <DrawerEmpleado
        isOpen={dOpen}
        onClose={() => setDOpen(false)}
        h={h}
      />
    </div>
  );
}