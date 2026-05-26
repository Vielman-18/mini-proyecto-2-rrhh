import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import type { Empleado, Nomina, DetalleNomina,} from '../types/nomina';

type Departamento = {
  id: number;
  nombre: string;
  descripcion?: string;
};

export function useNomina() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [nominas, setNominas] = useState<Nomina[]>([]);
  const [detalles, setDetalles] = useState<DetalleNomina[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [nominaId, setNominaId] = useState<string>('');

  const [empleadoId, setEmpleadoId] = useState('');
  const [tipoPeriodo, setTipoPeriodo] = useState('mensual');
  const [mes, setMes] = useState('mayo');
  const [anio, setAnio] = useState('2026');
  const [quincena, setQuincena] = useState<'Q1' | 'Q2'>('Q1');

  const [horasTrabajadas, setHorasTrabajadas] = useState(0);
  const [horasExtra, setHorasExtra] = useState(0);
  const [bonificaciones, setBonificaciones] = useState(0);
  const [comisiones, setComisiones] = useState(0);
  const [deducciones, setDeducciones] = useState(0);
  const [descuentosLegales, setDescuentosLegales] = useState(0);

  const [loading, setLoading] = useState(false);
  const [estadoActual, setEstadoActual] = useState<string>('');
  const [departamentoId, setDepartamentoId] = useState('');

  const normalizeEstadoNomina = (estado?: string) => {
    if (!estado || estado === 'abierta') return 'activa';
    if (estado === 'inactiva') return 'procesada';
    return estado;
  };

  const isNominaActiva = (estado?: string) =>
    normalizeEstadoNomina(estado) === 'activa';

const eliminarEmpleadoDeNomina = async (
  empleadoId: number,
) => {
  if (!isNominaActiva(estadoActual)) {
    toast.error(
      'Solo se pueden eliminar empleados de nóminas activas'
    );
    return;
  }

  if (!nominaId) {
    toast.error('Selecciona una nómina');
    return;
  }

  try {
    setLoading(true);

    await api.delete(
      `/nomina/${nominaId}/empleado/${empleadoId}`
    );

    toast.success('Empleado removido de la nómina');

    await cargarDetalles(nominaId);
  } catch (error) {
    console.error(error);
    toast.error('Error al eliminar de la nómina');
  } finally {
    setLoading(false);
  }
};

 const cargarDetalles = async (id?: string) => {
  try {
    if (!id || isNaN(Number(id))) {
      console.error('ID inválido:', id);
      return;
    }

    const res = await api.get(
      `/nomina/${Number(id)}/detalle`,
    );

    console.log('Detalles cargados:', res.data);

    setDetalles(res.data || []);
  } catch (error) {
    console.error('Error al cargar detalles:', error);
    setDetalles([]);
  }
};

const generarPdfEmpleado = async (detalleId: number) => {
  try {
    setLoading(true);

    const res = await api.get(
      `/nomina/detalle/${detalleId}/pdf`,
      {
        responseType: 'blob',
      },
    );

    const url = window.URL.createObjectURL(
      new Blob([res.data]),
    );

    const link = document.createElement('a');

    link.href = url;

    link.setAttribute(
      'download',
      `boleta_empleado_${detalleId}.pdf`,
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

    toast.success('Boleta generada');
  } catch (error) {
    console.error(error);
    toast.error('Error al generar boleta');
  } finally {
    setLoading(false);
  }
};

  const generarPdf = async () => {
  if (!nominaId) {
    toast.error('Selecciona una nómina');
    return;
  }

  try {
    setLoading(true);

    const res = await api.get(`/nomina/${nominaId}/pdf`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');

    const nomina = nominas.find(
      (n) => String(n.id) === String(nominaId)
    );

    link.href = url;
    link.setAttribute(
      'download',
      `nomina_${nomina?.periodo || nominaId}.pdf`
    );

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);

    toast.success('PDF generado');
  } catch {
    toast.error('Error al generar PDF');
  } finally {
    setLoading(false);
  }
};

  const cambiarEstado = async (nuevoEstado: string) => {
    if (!nominaId) {
      toast.error('Selecciona una nómina');
      return;
    }

    const estadoActualNormalizado = normalizeEstadoNomina(estadoActual);
    const nuevoEstadoNormalizado = normalizeEstadoNomina(nuevoEstado);

    if (
      estadoActualNormalizado === 'procesada' &&
      nuevoEstadoNormalizado !== 'procesada'
    ) {
      toast.error('No se puede reabrir una nómina procesada.');
      return;
    }

    if (
      estadoActualNormalizado === 'activa' &&
      nuevoEstadoNormalizado === 'procesada'
    ) {
      toast.error('La nómina debe cerrarse antes de procesarse.');
      return;
    }

    if (
      estadoActualNormalizado === 'cerrada' &&
      nuevoEstadoNormalizado !== 'procesada'
    ) {
      toast.error('Solo es posible procesar una nómina cerrada.');
      return;
    }

    try {
      setLoading(true);
      await api.put(`/nomina/${nominaId}/estado`, { estado: nuevoEstado });
      setEstadoActual(nuevoEstado);
      
      setNominas(nominas.map(n => 
        String(n.id) === String(nominaId) 
          ? { ...n, estado: nuevoEstado }
          : n
      ));
      
      toast.success(`Nómina marcada como ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      toast.error('Error al cambiar estado');
    } finally {
      setLoading(false);
    }
  };

  const cargarDatos = async () => {
    try {
      const [emp, nom, deps] = await Promise.all([
        api.get('/empleados'),
        api.get('/nomina'),
        api.get('/departamentos'),
      ]);

      const nominasNormalizadas = nom.data.map((nomina: Nomina) => ({
        ...nomina,
        estado: normalizeEstadoNomina(nomina.estado),
      }));

      console.log('Nóminas cargadas:', nominasNormalizadas);
      setEmpleados(emp.data.filter((e: Empleado) => e.estado === 'activo'));
      setNominas(nominasNormalizadas);
      setDepartamentos(deps.data || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar datos');
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

const crearNomina = async (): Promise<boolean> => {
  const periodoValue =
    tipoPeriodo === 'quincenal'
      ? `${mes}${anio}${quincena}`
      : `${mes}${anio}`;

  if (!periodoValue) {
    toast.error('Selecciona el periodo de la nómina');
    return false;
  }

  try {
    setLoading(true);

    const res = await api.post('/nomina', {
      tipo_periodo: tipoPeriodo,
      periodo: periodoValue,
      estado: 'activa',
    });

    const data = Array.isArray(res.data) ? res.data : [res.data];

    if (!data || data.length === 0) {
      toast.error('No se creó la nómina');
      return true;
    }

    const nominaSeleccionada = String(
      data[data.length - 1]?.id || data[0]?.id
    );

    setNominaId(nominaSeleccionada);
    setMes('mayo');
    setAnio('2026');
    setQuincena('Q1');

    toast.success(
      data.length > 1
        ? `Se generaron ${data.length} nóminas`
        : 'Nómina generada'
    );

    await cargarDatos();
    await cargarDetalles(nominaSeleccionada);
    return true;
  } catch (error) {
    console.error(error);
    toast.error('Error al crear nómina');
    return false;
  } finally {
    setLoading(false);
  }
};

const agregarDetalle = async () => {
  if (!isNominaActiva(estadoActual)) {
    toast.error('Solo se pueden agregar empleados a nóminas ACTIVA.');
    return;
  }

  if (!nominaId || isNaN(Number(nominaId))) {
    toast.error('Nómina inválida');
    return;
  }
  if (!empleadoId || isNaN(Number(empleadoId))) {
    toast.error('Empleado inválido');
    return;
  }

  const emp = empleados.find(e => String(e.id) === empleadoId);

  try {
    setLoading(true);

    await api.post('/nomina/detalle', {
      nomina_id: Number(nominaId),
      empleado_id: Number(empleadoId),

      salario_base: Number(emp?.salario || 0),
      horas_trabajadas: Number(horasTrabajadas),
      horas_extra: Number(horasExtra),

      bonificaciones: Number(bonificaciones),
      comisiones: Number(comisiones),
      descuentos_legales: Number(descuentosLegales),
    });

    toast.success('Empleado agregado');

    setEmpleadoId('');
    setHorasExtra(0);
    setBonificaciones(0);
    setComisiones(0);
    setDescuentosLegales(0);

    await cargarDetalles(nominaId);
  } catch {
    toast.error('Error al agregar detalle');
  } finally {
    setLoading(false);
  }
};

  const resumen = useMemo(() => {
    return {
      total: detalles.reduce((a, d) => a + Number(d.salario_final || 0), 0),
      empleados: detalles.length,
    };
  }, [detalles]);

const formatDate = (date: string) => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('es-GT', {
    timeZone: 'UTC',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
};
  const agregarTodosEmpleados = async () => {
  if (!isNominaActiva(estadoActual)) {
    toast.error('Solo se pueden agregar empleados a nóminas ACTIVA.');
    return;
  }

  if (!nominaId) {
    toast.error('Selecciona una nómina');
    return;
  }

  try {
    setLoading(true);

    const res = await api.post(`/nomina/${nominaId}/agregar-todos`);

    toast.success(`Se agregaron ${res.data.total_agregados} empleados`);

    await cargarDetalles(nominaId);
  } catch (error) {
    console.error(error);
    toast.error('Error al agregar empleados');
  } finally {
    setLoading(false);
  }
};

const agregarEmpleadosPorDepartamento = async (departamentoId: number) => {
  if (!isNominaActiva(estadoActual)) {
    toast.error('Solo se pueden agregar empleados a nóminas ACTIVA.');
    return;
  }

  try {
    setLoading(true);

    const res = await api.post(`/nomina/${nominaId}/departamento/${departamentoId}`);

    toast.success(`Se agregaron ${res.data.total_agregados} empleados`);

    await cargarDetalles(nominaId);
  } catch (error) {
    console.error(error);
    toast.error('Error al agregar empleados');
  } finally {
    setLoading(false);
  }
};

const eliminarNomina = async (id: number) => {
  const nomina = nominas.find((n) => n.id === id);

  if (nomina && !isNominaActiva(nomina.estado)) {
    toast.error('Solo se pueden eliminar nóminas ACTIVA.');
    return;
  }

  if (!confirm('¿Deseas eliminar esta nómina?')) return;

  try {
    setLoading(true);
    await api.delete(`/nomina/${id}/delete`);
    toast.success('Nómina eliminada');
    if (String(id) === nominaId) {
      setNominaId('');
    }
    await cargarDatos();
  } catch (error) {
    console.error(error);
    toast.error('Error al eliminar la nómina');
  } finally {
    setLoading(false);
  }
};

  return {
    empleados,
    nominas,
    detalles,
    nominaId,
    setNominaId,

    empleadoId,
    setEmpleadoId,

    tipoPeriodo,
    setTipoPeriodo,
    mes,
    setMes,
    anio,
    setAnio,
    quincena,
    setQuincena,
    formatDate,

    horasTrabajadas,
    setHorasTrabajadas,
    horasExtra,
    setHorasExtra,
    bonificaciones,
    setBonificaciones,
    comisiones,
    setComisiones,
    deducciones,
    setDeducciones,
    descuentosLegales,
    setDescuentosLegales,

    departamentoId,
setDepartamentoId,

    loading,

    crearNomina,
    agregarDetalle,
    cargarDetalles,
    cambiarEstado,
    eliminarNomina,

    estadoActual,
    setEstadoActual,

    resumen,
    generarPdf,
    generarPdfEmpleado,
    eliminarEmpleadoDeNomina,
    agregarTodosEmpleados,
    agregarEmpleadosPorDepartamento,
    departamentos,
  };
}