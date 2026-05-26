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

  const normalizeEstado = (estado: string) => {
    if (!estado || estado === 'abierta') return 'activa';
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
                        n.estado === 'activa'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : n.estado === 'cerrada' || n.estado === 'procesada'
                          ? 'bg-amber-400/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
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
                          onClick={() => h.eliminarNomina(n.id)}
                          disabled={n.estado === 'cerrada' || n.estado === 'procesada'}
                           className={`px-4 py-2 rounded ${
                                n.estado === 'cerrada'
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-red-600 hover:bg-red-700'
                              }`}
                            >
                          Eliminar
                        </button>
                      </div>
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

  {/* HEADER SUPERIOR */}
 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

  {/* INFO IZQUIERDA */}
  <div>
    <button
      onClick={() => h.setNominaId('')}
      className="text-cyan-400 mb-3 hover:underline"
    >
      ← Volver
    </button>

    <h2 className="text-3xl font-black">
      Nómina #{h.nominaId}
    </h2>

    <p className="text-slate-400 text-sm mt-1">
      Gestión de empleados, salarios y deducciones
    </p>

    {/* ESTADO */}
    <div className="mt-4 flex items-center gap-3">
      <label className="text-slate-400 text-sm">Estado:</label>

      <select
        value={estadoActualNormalizado}
        onChange={(e) => h.cambiarEstado(e.target.value)}
        disabled={h.loading || estadoActualNormalizado === 'procesada'}
        className="bg-[#05070a] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 disabled:opacity-60"
      >
        {estadoOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <span
        className={`px-3 py-1 rounded-xl text-xs font-bold ${
          estadoActualNormalizado === 'activa'
            ? 'bg-emerald-500/10 text-emerald-400'
            : estadoActualNormalizado === 'cerrada'
            ? 'bg-amber-500/10 text-amber-400'
            : 'bg-slate-500/10 text-slate-300'
        }`}
      >
        {estadoActualNormalizado.toUpperCase()}
      </span>
    </div>
  </div>

  {/* ACCIONES DERECHA */}
  <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">

    {/* BOTÓN: TODOS */}
    <button
      onClick={h.agregarTodosEmpleados}
      disabled={!isNominaEditable || h.loading}
      className="px-5 py-3 bg-white hover:bg-slate-200 transition text-black font-black rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed"
    >
      + Agregar todos
    </button>

    {/* SELECT DEPARTAMENTO */}
    <select
      value={h.departamentoId}
      onChange={(e) => h.setDepartamentoId(e.target.value)}
      className="px-4 py-3 bg-[#05070a] border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-400"
    >
      <option value="">Departamento</option>

      {h.departamentos.map((d: any) => (
        <option key={d.id} value={d.id}>
          {d.nombre}
        </option>
      ))}
    </select>

    {/* BOTÓN: POR DEPARTAMENTO */}
    <button
      onClick={() =>
        h.agregarEmpleadosPorDepartamento(Number(h.departamentoId))
      }
      disabled={
        !isNominaEditable ||
        h.loading ||
        !h.departamentoId
      }
      className="px-5 py-3 bg-cyan-400 hover:bg-cyan-300 transition text-black font-black rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed"
    >
      + Por departamento
    </button>

  </div>
</div>

  {/* KPIs */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

    <div className="bg-[#05070a] border border-white/10 rounded-2xl p-4">
      <p className="text-slate-400 text-sm">Empleados</p>
      <p className="text-2xl font-black text-white">
        {h.resumen.empleados}
      </p>
    </div>

    <div className="bg-[#05070a] border border-white/10 rounded-2xl p-4">
      <p className="text-slate-400 text-sm">Total Nómina</p>
      <p className="text-2xl font-black text-cyan-400">
        {quetzal(h.resumen.total)}
      </p>
    </div>

    <div className="bg-[#05070a] border border-white/10 rounded-2xl p-4">
      <p className="text-slate-400 text-sm">Estado</p>
      <p className="text-xl font-black">
        {estadoActualNormalizado.toUpperCase()}
      </p>
    </div>

  </div>

  {/* EXPORTAR */}
  <div className="mb-6 flex justify-end">
    <button
      type="button"
      onClick={h.generarPdf}
      disabled={h.loading || !h.nominaId}
      className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-black disabled:opacity-60"
    >
      {h.loading ? 'Generando...' : 'Exportar PDF'}
    </button>
  </div>

  {/* TABLA */}
  <div className="overflow-x-auto">
    <table className="w-full text-left">

      <thead className="text-slate-400 text-sm bg-white/5">
        <tr>
          <th className="py-4">ID</th>
          <th className="py-4">Empleado</th>
          <th className="py-4">Salario Base</th>
          <th className="py-4">Deducciones</th>
          <th className="py-4">Salario Final</th>
          <th className="py-4 text-right">Acciones</th>
        </tr>
      </thead>

      <tbody>

        {h.loading && (
          <tr>
            <td colSpan={6} className="text-center py-10 text-slate-400">
              Cargando empleados...
            </td>
          </tr>
        )}

        {!h.loading &&
          h.detalles.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-10 text-slate-500">
                No hay empleados agregados
              </td>
            </tr>
          )}

        {!h.loading &&
          h.detalles.map((d) => (
            <tr
              key={d.id}
              className="border-t border-white/10 hover:bg-white/5 transition"
            >

              <td className="py-4 text-slate-300">
                #{d.id}
              </td>

              <td className="py-4">
                <button
                  onClick={() => {
                    setDetalle(d);
                    setDetalleOpen(true);
                  }}
                  className="text-cyan-400 hover:underline font-semibold"
                >
                  {d.empleados?.nombres}{' '}
                  {d.empleados?.apellidos}
                </button>
              </td>

              <td className="py-4">
                {quetzal(d.salario_base)}
              </td>

              <td className="py-4 text-rose-400">
                {quetzal(d.deducciones)}
              </td>

              <td className="py-4 font-bold text-cyan-400">
                {quetzal(d.salario_final)}
              </td>

              <td className="py-4 text-right">
                <button
                  onClick={() =>
                    h.eliminarEmpleadoDeNomina(
                      d.empleado_id,
                    )
                  }
                  disabled={
                    estadoActualNormalizado !== 'activa' ||
                    h.loading
                  }
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                    estadoActualNormalizado !== 'activa'
                      ? 'bg-gray-500 cursor-not-allowed text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  Eliminar
                </button>
              </td>

            </tr>
          ))}

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
        h={h}
      />

      <DrawerEmpleado
        isOpen={dOpen}
        onClose={() => setDOpen(false)}
        h={h}
      />
    </div>
  );
}