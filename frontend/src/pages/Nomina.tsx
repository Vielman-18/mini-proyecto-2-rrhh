import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNomina } from '../hooks/NominaLogic';
import {
  ModalPeriodo,
  ModalConfirmacionAction
} from '../components/NominaWidgets';

export default function Nomina() {

  const navigate = useNavigate();
  const h = useNomina();

  const [mOpen, setMOpen] = useState(false);
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
            Nóminas
          </h1>

          <p className="text-slate-400 mt-2">
            Gestión de nóminas
          </p>
        </div>

        <button
          onClick={() => setMOpen(true)}
          className="px-5 py-3 bg-cyan-400 hover:bg-cyan-300 transition text-black font-black rounded-2xl"
        >
          + Crear Nómina
        </button>

      </div>

      {/* CONTENEDOR */}
      <div className="bg-[#0b1017] border border-white/10 rounded-3xl overflow-hidden">

        {/* BUSCADOR */}
        <div className="p-5 border-b border-white/10">

          <input
            type="text"
            placeholder="Buscar nómina por periodo o ID..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-400"
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
                <th className="px-5 py-4 text-right">Acciones</th>
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

                  <td className="px-5 py-4 capitalize">
                    {n.periodo}
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        n.estado === 'activa'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : n.estado === 'cerrada' || n.estado === 'procesada'
                          ? 'bg-amber-400/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {n.estado.toUpperCase()}
                    </span>

                  </td>

                  <td className="px-5 py-4 text-right">

                    <div className="flex items-center justify-end gap-3">

                      <button
                        onClick={() => {
                          navigate(`/rrhh/detalle-nomina/${n.id}`, {
                            state: {
                              estado: n.estado
                            }
                          });
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold"
                      >
                        Gestionar
                      </button>

                      <button
                        onClick={() => h.solicitarEliminarNomina(n.id)}
                        disabled={
                          n.estado === 'cerrada' ||
                          n.estado === 'procesada'
                        }
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

      {/* MODALES */}
      <ModalPeriodo
        isOpen={mOpen}
        onClose={() => setMOpen(false)}
        h={h}
      />

      <ModalConfirmacionAction
        isOpen={h.confirmacionOpen}
        onClose={() => h.setConfirmacionOpen(false)}
        onConfirm={() =>
          h.confirmacionAccion &&
          h.confirmacionAccion()
        }
        titulo={h.confirmacionTitulo}
        mensaje={h.confirmacionMensaje}
        loading={h.loading}
      />

    </div>
  );
}