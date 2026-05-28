import { useEffect, useState } from 'react';
import api from '../api/axios';

type HistorialItem = {
  id: number;
  campo_modificado: string;
  valor_anterior: number | null;
  valor_nuevo: number | null;
  fecha_cambio: string;

  usuarios?: { nombre: string };

  detalle_nomina?: {
    empleados?: {
      nombres: string;
      apellidos: string;
    };
  };
};

type Props = {
  isOpen?: boolean;
  onClose?: () => void;
  detalleId?: number;
};

export default function HistorialNominaModal({
  isOpen = false,
  onClose = () => {},
  detalleId,
}: Props) {
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !detalleId) return;
    cargarHistorial();
  }, [isOpen, detalleId]);

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/historial-nomina/detalle/${detalleId}`);
      setHistorial(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-5xl rounded-xl bg-[#0b1017] border border-white/10 overflow-hidden">

        {/* HEADER */}
        <div className="px-5 py-3 border-b border-white/10">
          <h2 className="text-white font-semibold">
            Historial de nómina
          </h2>
          <p className="text-xs text-slate-400">
            Usuario | Empleado | Concepto | Valores | Fecha
          </p>
        </div>

        {/* BODY */}
        <div className="max-h-[70vh] overflow-y-auto">

          {loading && (
            <div className="p-6 text-sm text-slate-400">
              Cargando...
            </div>
          )}

          {!loading && historial.length === 0 && (
            <div className="p-6 text-sm text-slate-400">
              No hay registros
            </div>
          )}

          {!loading && historial.length > 0 && (
            <div className="divide-y divide-white/10 text-sm">

              {historial.map((item) => {
                const empleado = item.detalle_nomina?.empleados
                  ? `${item.detalle_nomina.empleados.nombres} ${item.detalle_nomina.empleados.apellidos}`
                  : 'Sin empleado';

                return (
                  <div key={item.id} className="px-5 py-3 text-slate-300">

                    {/* UNA SOLA FILA ORDENADA */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">

                      <div>
                        <p className="text-xs text-slate-500">Usuario</p>
                        <p className="text-white">{item.usuarios?.nombre || 'Sistema'}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Empleado</p>
                        <p className="text-white">{empleado}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Concepto</p>
                        <p className="text-cyan-400">{item.campo_modificado}</p>
                      </div>
<div>
  <p className="text-xs text-slate-500">Antes / Después</p>
  <p>
    <span className="text-red-400">
      {item.valor_anterior ?? 0}
    </span>
    {' → '}
    <span className="text-emerald-400">
      {item.valor_nuevo ?? 0}
    </span>
  </p>
</div>

                      <div>
                        <p className="text-xs text-slate-500">Fecha</p>
                        <p className="text-slate-300">
                          {new Date(item.fecha_cambio).toLocaleString('es-GT')}
                        </p>
                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={onClose}
            className="w-full bg-white text-black py-2 rounded-lg text-sm"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}