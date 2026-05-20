import React, { useState } from 'react';
import { useNomina } from '../hooks/NominaLogic';
import { ModalPeriodo, DrawerEmpleado, quetzal } from '../components/NominaWidgets';

export default function Nomina() {
  const h = useNomina();

  const [mOpen, setMOpen] = useState(false);
  const [dOpen, setDOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');

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
          className="
            px-5 py-3
            bg-cyan-400
            hover:bg-cyan-300
            transition
            text-black
            font-black
            rounded-2xl
          "
        >
          + Crear Nómina
        </button>
      </div>

      {/* LISTADO */}
      {!h.nominaId ? (
        <div className="bg-[#0b1017] border border-white/10 rounded-3xl overflow-hidden">

          {/* TOP */}
          <div className="p-5 border-b border-white/10">

            <input
              type="text"
              placeholder="Buscar nómina..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="
                w-full
                bg-[#05070a]
                border border-white/10
                rounded-xl
                px-4 py-3
                outline-none
                focus:border-cyan-400
              "
            />
          </div>

          {/* TABLA */}
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
                  <tr
                    key={n.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="px-5 py-4 font-bold">
                      #{n.id}
                    </td>

                    <td className="px-5 py-4">
                      {n.periodo}
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-3 py-1 bg-cyan-400/10 text-cyan-400 rounded-full text-xs font-bold">
                        {n.estado}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => {
                          h.setNominaId(String(n.id));
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
                    <td
                      colSpan={4}
                      className="text-center py-10 text-slate-500"
                    >
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

          {/* TOP */}
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
            </div>

            <button
              onClick={() => setDOpen(true)}
              className="
                px-5 py-3
                bg-white
                hover:bg-slate-200
                transition
                text-black
                font-black
                rounded-2xl
              "
            >
              + Agregar empleado
            </button>
          </div>

          {/* RESUMEN */}
          <div className="mb-6 bg-[#05070a] border border-white/10 rounded-2xl p-5">
            <p className="text-slate-400 text-sm mb-2">
              Total Nómina
            </p>

            <h3 className="text-3xl font-black text-cyan-400">
              {quetzal(h.resumen.total)}
            </h3>
          </div>

          {/* TABLA */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">

              <thead className="text-slate-400 text-sm">
                <tr>
                  <th className="py-4">ID</th>
                  <th className="py-4">Empleado</th>
                  <th className="py-4">Salario Base</th>
                  <th className="py-4">IGSS</th>
                  <th className="py-4">HorasExtras</th>
                  <th className="py-4">DeDucciones</th>
                  <th className="py-4">Salario Final</th>
                 
                </tr>
              </thead>

              <tbody>
                {h.detalles.map((d) => (
                  <tr
                    key={d.id}
                    className="border-t border-white/10">
                      <td className="py-4">
                      {d.empleados?.id}
                    </td>
                    <td className="py-4">
                      {d.empleados?.nombres} {d.empleados?.apellidos}
                    </td>
                    <td className="py-4">
                      {quetzal(d.salario_base)}
                    </td>
                    <td className="py-4">
                      {quetzal(d.igss)}
                    </td>
                    <td className="py-4">
                      {quetzal(d.horas_extra)}
                    </td>
                    <td className="py-4">
                      {quetzal(d.deducciones)}
                    </td>
                    <td className="py-4 font-bold text-cyan-400">
                      {quetzal(d.salario_final)}
                    </td>
                  </tr>
                ))}

                {!h.detalles.length && (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-10 text-slate-500"
                    >
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

      <DrawerEmpleado
        isOpen={dOpen}
        onClose={() => setDOpen(false)}
        h={h}
      />
    </div>
  );
}