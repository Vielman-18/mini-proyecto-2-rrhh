import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const documentosObligatorios = [
  'DPI',
  'Contrato firmado',
  'Certificado de estudios',
  'Antecedentes penales',
  'Antecedentes policiales',
];

export default function Expedientes() {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [empleadoId, setEmpleadoId] = useState('');
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [tipo, setTipo] = useState('DPI');
  const [archivo, setArchivo] = useState<File | null>(null);

  useEffect(() => {
    api.get('/empleados').then((res) => setEmpleados(res.data));
  }, []);

  const cargarDocumentos = async (id: string) => {
    setEmpleadoId(id);

    if (!id) {
      setDocumentos([]);
      return;
    }

    try {
      const res = await api.get(`/expedientes/empleado/${id}`);
      setDocumentos(res.data);
    } catch {
      setDocumentos([]);
    }
  };

  const subirDocumento = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!empleadoId || !archivo) {
      toast.error('Selecciona empleado y archivo');
      return;
    }

    const formData = new FormData();
    formData.append('empleadoId', empleadoId);
    formData.append('tipo', tipo);
    formData.append('archivo', archivo);

    try {
      await api.post('/expedientes/upload', formData);
      toast.success('Documento subido');
      setArchivo(null);
      cargarDocumentos(empleadoId);
    } catch {
      toast.error('Error al subir documento');
    }
  };

  const tiposSubidos = documentos.map((d) => d.tipo);
  const faltantes = documentosObligatorios.filter((doc) => !tiposSubidos.includes(doc));
  const estado = faltantes.length === 0 ? 'Completo' : documentos.length === 0 ? 'Incompleto' : 'En proceso';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Expedientes</h1>
        <p className="text-slate-400">Carga y validación de documentos del empleado</p>
      </div>

      <section className="rounded-2xl border border-blue-500/10 bg-slate-950/80 p-6">
        <label className="mb-2 block text-sm text-slate-300">Empleado</label>
        <select
          value={empleadoId}
          onChange={(e) => cargarDocumentos(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
        >
          <option value="">Seleccionar empleado</option>
          {empleados.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.nombres} {emp.apellidos}
            </option>
          ))}
        </select>
      </section>

      {empleadoId && (
        <>
          <section className="rounded-2xl border border-blue-500/10 bg-slate-950/80 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Estado del expediente</h2>

            <span className={`rounded-full px-4 py-2 text-sm font-semibold ${
              estado === 'Completo'
                ? 'bg-green-500/10 text-green-400'
                : estado === 'En proceso'
                ? 'bg-amber-500/10 text-amber-400'
                : 'bg-red-500/10 text-red-400'
            }`}>
              {estado}
            </span>

            {faltantes.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-sm text-slate-400">Documentos faltantes:</p>
                <div className="flex flex-wrap gap-2">
                  {faltantes.map((doc) => (
                    <span key={doc} className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-400">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          <form onSubmit={subirDocumento} className="grid gap-4 rounded-2xl border border-blue-500/10 bg-slate-950/80 p-6 md:grid-cols-3">
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
            >
              {documentosObligatorios.map((doc) => (
                <option key={doc} value={doc}>{doc}</option>
              ))}
            </select>

            <input
              type="file"
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
            />

            <button className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
              Subir documento
            </button>
          </form>

          <section className="rounded-2xl border border-blue-500/10 bg-slate-950/80 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Documentos cargados</h2>

            <div className="space-y-3">
              {documentos.map((doc) => (
                <div key={doc.id} className="flex justify-between rounded-xl bg-slate-900 p-4">
                  <div>
                    <p className="font-semibold text-white">{doc.tipo}</p>
                    <p className="text-sm text-slate-400">{doc.nombreArchivo || doc.nombre}</p>
                  </div>
                  <a
                    href={`http://localhost:3000/expedientes/descargar/${doc.id}`}
                    target="_blank"
                    className="text-blue-400"
                  >
                    Descargar
                  </a>
                </div>
              ))}

              {documentos.length === 0 && (
                <p className="text-slate-500">No hay documentos cargados.</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}