import { type Empleado, type EstadoEmpleado } from '../types/empleado';
import { useEmpleados } from '../hooks/Empleados.Logic';

export default function Empleados() {
  const {
    empleados,
    departamentos,
    puestos,
    form,
    setForm,
    editando,
    loading,
    guardarEmpleado,
    editarEmpleado,
    eliminarEmpleado,
    cambiarEstado,
    handleDepartamentoChange,
    errors,
    cancelarEdicion,
  } = useEmpleados();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Gestión de Empleados
        </h1>
        <p className="text-slate-400">
          Crear, editar, eliminar y cambiar estado de empleados
        </p>
      </div>

      {/* FORMULARIO */}
      <form
        onSubmit={guardarEmpleado}
        className="grid gap-4 rounded-2xl border border-blue-500/10 bg-slate-950/80 p-6 shadow-lg shadow-black/10 md:grid-cols-2"
      >
        {[
          { name: 'nombres', label: 'Nombres *', type: 'text' },
          { name: 'apellidos', label: 'Apellidos *', type: 'text' },
          { name: 'dpi', label: 'DPI * (13 dígitos)', type: 'text' },
          { name: 'fechaNacimiento', label: 'Fecha de nacimiento *', type: 'date' },
          { name: 'direccion', label: 'Dirección *', type: 'text' },
          { name: 'telefono', label: 'Teléfono *', type: 'text' },
          { name: 'email', label: 'Email *', type: 'email' },
          { name: 'salario', label: 'Salario *', type: 'number' },
        ].map(({ name, label, type }) => (
          <div key={name}>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              {label}
            </label>

            <input
              type={type}
              value={form[name as keyof Empleado] || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  [name]: e.target.value,
                })
              }
              maxLength={name === 'dpi' ? 13 : undefined}
              className={`w-full rounded-xl border bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500 ${
                errors?.[name]
                  ? 'border-red-500'
                  : 'border-slate-700'
              }`}
            />

            {errors?.[name] && (
              <p className="mt-1 text-xs text-red-400">
                {errors[name]}
              </p>
            )}
          </div>
        ))}

        {/* DEPARTAMENTO */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Departamento *
          </label>

          <select
            value={form.departamento_id || ''}
            onChange={(e) => handleDepartamentoChange(e.target.value)}
            className={`w-full rounded-xl border bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500 ${
              errors?.departamento_id
                ? 'border-red-500'
                : 'border-slate-700'
            }`}
          >
            <option value="">Seleccionar departamento</option>
            {departamentos.map((depto) => (
              <option key={depto.id} value={depto.id}>
                {depto.nombre}
              </option>
            ))}
          </select>

          {errors?.departamento_id && (
            <p className="mt-1 text-xs text-red-400">
              {errors.departamento_id}
            </p>
          )}
        </div>

        {/* PUESTO */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Puesto *
          </label>

          <select
            value={form.puesto_id || ''}
            onChange={(e) =>
              setForm({
                ...form,
                puesto_id: e.target.value
                  ? parseInt(e.target.value)
                  : null,
              })
            }
            disabled={!form.departamento_id}
            className={`w-full rounded-xl border bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500 disabled:opacity-50 ${
              errors?.puesto_id
                ? 'border-red-500'
                : 'border-slate-700'
            }`}
          >
            <option value="">
              {form.departamento_id
                ? 'Seleccionar puesto'
                : 'Primero selecciona un departamento'}
            </option>

            {puestos.map((puesto) => (
              <option key={puesto.id} value={puesto.id}>
                {puesto.nombre}
              </option>
            ))}
          </select>

          {errors?.puesto_id && (
            <p className="mt-1 text-xs text-red-400">
              {errors.puesto_id}
            </p>
          )}
        </div>

        {/* BOTONES */}
        <div className="flex items-end gap-3 md:col-span-2">
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            {editando ? 'Actualizar empleado' : 'Crear empleado'}
          </button>

          {editando && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="rounded-xl bg-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-600"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* TABLA */}
      <div className="overflow-hidden rounded-2xl border border-blue-500/10 bg-slate-950/80 shadow-lg shadow-black/10">
        <div className="flex items-center justify-between border-b border-blue-500/10 px-6 py-5">
          <h2 className="text-xl font-semibold text-white">
            Lista de empleados
          </h2>

          <span className="text-sm text-slate-400">
            {loading ? 'Cargando...' : `${empleados.length} registros`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-500/5">
                {[
                  'Empleado',
                  'DPI',
                  'Contacto',
                  'Puesto',
                  'Departamento',
                  'Salario',
                  'Estado',
                  'Acciones',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {empleados.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-t border-blue-500/5 transition hover:bg-blue-500/5"
                >
                  <td className="px-4 py-4 text-white font-medium">
                    {emp.nombres} {emp.apellidos}
                  </td>

                  <td className="px-4 py-4 text-slate-400">
                    {emp.dpi}
                  </td>

                  <td className="px-4 py-4 text-slate-400">
                    {emp.telefono} <br />
                    <span className="text-xs">{emp.email}</span>
                  </td>

                  <td className="px-4 py-4 text-slate-400">
                    {emp.puestos?.nombre || 'Sin puesto'}
                  </td>

                  <td className="px-4 py-4 text-slate-400">
                    {emp.departamentos?.nombre || 'Sin departamento'}
                  </td>

                  <td className="px-4 py-4 text-blue-400 font-semibold">
                    Q{Number(emp.salario || 0).toLocaleString()}
                  </td>

                  <td className="px-4 py-4">
                    <select
                      value={emp.estado || 'activo'}
                      onChange={(e) =>
                        cambiarEstado(
                          emp.id,
                          e.target.value as EstadoEmpleado,
                        )
                      }
                      className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                    >
                      <option value="activo">Activo</option>
                      <option value="suspendido">Suspendido</option>
                      <option value="retirado">Retirado</option>
                    </select>
                  </td>

                  <td className="px-4 py-4 flex gap-2">
                    <button
                      onClick={() => editarEmpleado(emp)}
                      className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-400"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => eliminarEmpleado(emp.id)}
                      className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && empleados.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 text-center text-slate-500"
                  >
                    No hay empleados registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
