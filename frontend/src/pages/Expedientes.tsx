import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

type Empleado = {
  id: number;
  usuario_id?: number | null;
  nombres: string;
  apellidos: string;
  email?: string | null;
};

type Documento = {
  id: number;
  empleado_id: number;
  usuario_id: number;
  nombre_archivo: string;
  ruta_archivo: string;
  tipo_documento: string;
  fecha_carga?: string;
};

const documentosObligatorios = [
  'DPI',
  'Contrato firmado',
  'Certificado de estudios',
  'Antecedentes penales',
  'Antecedentes policiales',
];

export default function Expedientes() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [empleadoId, setEmpleadoId] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [tipo, setTipo] = useState('DPI');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const res = await api.get('/empleados');
      setEmpleados(res.data);
    } catch {
      toast.error('Error al cargar empleados');
    }
  };

  const cargarDocumentos = async (id: string) => {
    setEmpleadoId(id);
    setDocumentos([]);

    const empleado = empleados.find((e) => String(e.id) === id);
    setUsuarioId(String(empleado?.usuario_id || 1));

    if (!id) return;

    try {
      const res = await api.get(`/expedientes/empleado/${id}`);
      setDocumentos(res.data);
    } catch {
      setDocumentos([]);
    }
  };

  const subirDocumento = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!empleadoId) {
      toast.error('Selecciona un empleado');
      return;
    }

    if (!archivo) {
      toast.error('Selecciona un archivo PDF');
      return;
    }

    if (archivo.type !== 'application/pdf') {
      toast.error('Solo se permiten archivos PDF');
      return;
    }

    const formData = new FormData();
    formData.append('empleado_id', empleadoId);
    formData.append('usuario_id', usuarioId || '1');
    formData.append('tipo_documento', tipo);
    formData.append('archivo', archivo);

    try {
      setLoading(true);
      await api.post('/expedientes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Documento subido correctamente');
      setArchivo(null);

      const input = document.getElementById('archivo') as HTMLInputElement;
      if (input) input.value = '';

      await cargarDocumentos(empleadoId);
    } catch {
      toast.error('Error al subir documento');
    } finally {
      setLoading(false);
    }
  };

  const tiposSubidos = documentos.map((d) => d.tipo_documento);
  const faltantes = documentosObligatorios.filter(
    (doc) => !tiposSubidos.includes(doc),
  );

  const estado =
    faltantes.length === 0
      ? 'Completo'
      : documentos.length === 0
      ? 'Incompleto'
      : 'En proceso';

  return (
    <div className="min-h-screen space-y-8 bg-slate-950 p-6 text-white">
      <div>
        <h1 className="text-3xl font-bold">Expedientes</h1>
        <p className="text-slate-400">
          Carga y validación de documentos del empleado
        </p>
      </div>

      <section className="rounded-2xl border border-blue-500/20 bg-slate-900 p-6 shadow-lg">
        <label className="mb-2 block text-sm text-slate-300">
          Seleccionar empleado
        </label>

        <select
          value={empleadoId}
          onChange={(e) => cargarDocumentos(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
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
          <section className="rounded-2xl border border-blue-500/20 bg-slate-900 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">
              Estado del expediente
            </h2>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                estado === 'Completo'
                  ? 'bg-green-500/10 text-green-400'
                  : estado === 'En proceso'
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'bg-red-500/10 text-red-400'
              }`}
            >
              {estado}
            </span>

            {faltantes.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-sm text-slate-400">
                  Documentos faltantes:
                </p>

                <div className="flex flex-wrap gap-2">
                  {faltantes.map((doc) => (
                    <span
                      key={doc}
                      className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-400"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          <form
            onSubmit={subirDocumento}
            className="grid gap-4 rounded-2xl border border-blue-500/20 bg-slate-900 p-6 shadow-lg md:grid-cols-3"
          >
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              {documentosObligatorios.map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </select>

            <input
              id="archivo"
              type="file"
              accept="application/pdf"
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white"
            />

            <button
              disabled={loading}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Subiendo...' : 'Subir documento'}
            </button>
          </form>

          <section className="rounded-2xl border border-blue-500/20 bg-slate-900 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">
              Documentos cargados
            </h2>

            <div className="space-y-3">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col justify-between gap-3 rounded-xl bg-slate-950 p-4 md:flex-row md:items-center"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {doc.tipo_documento}
                    </p>

                    <p className="text-sm text-slate-400">
                      {doc.nombre_archivo}
                    </p>

                    {doc.fecha_carga && (
                      <p className="text-xs text-slate-500">
                        {new Date(doc.fecha_carga).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <a
                    href={`http://localhost:3000/expedientes/archivo/${doc.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-blue-500/30 px-4 py-2 text-center text-sm font-semibold text-blue-400 hover:bg-blue-500/10"
                  >
                    Descargar
                  </a>
                </div>
              ))}

              {documentos.length === 0 && (
                <p className="text-slate-500">
                  No hay documentos cargados.
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}