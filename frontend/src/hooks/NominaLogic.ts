import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import type { Empleado, Nomina, DetalleNomina,} from '../types/nomina';

export function useNomina() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [nominas, setNominas] = useState<Nomina[]>([]);
  const [detalles, setDetalles] = useState<DetalleNomina[]>([]);
  const [nominaId, setNominaId] = useState<string>('');

  const [empleadoId, setEmpleadoId] = useState('');
  const [tipoPeriodo, setTipoPeriodo] = useState('mensual');
  const [periodo, setPeriodo] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [mesInicio, setMesInicio] = useState('');
const [mesFin, setMesFin] = useState('');

  const [horasTrabajadas, setHorasTrabajadas] = useState(0);
  const [horasExtra, setHorasExtra] = useState(0);
  const [bonificaciones, setBonificaciones] = useState(0);
  const [comisiones, setComisiones] = useState(0);
  const [deducciones, setDeducciones] = useState(0);
  const [descuentosLegales, setDescuentosLegales] = useState(0);

  const [loading, setLoading] = useState(false);
  const [estadoActual, setEstadoActual] = useState<string>('');

  const eliminarEmpleadoDeNomina = async (empleadoId: number) => {
  if (!nominaId) {
    toast.error('Selecciona una nómina');
    return;
  }

  try {
    setLoading(true);

    await api.delete(`/nomina/${nominaId}/empleado/${empleadoId}`);

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
      const [emp, nom] = await Promise.all([
        api.get('/empleados'),
        api.get('/nomina'),
      ]);

      console.log('Nóminas cargadas:', nom.data);
      setEmpleados(emp.data.filter((e: Empleado) => e.estado === 'activo'));
      setNominas(nom.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar datos');
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

const crearNomina = async () => {
  if (!mesInicio || !mesFin) {
    toast.error('Selecciona los meses');
    return;
  }

  const mesPattern = /^\d{4}-\d{2}$/;
  if (!mesPattern.test(mesInicio) || !mesPattern.test(mesFin)) {
    toast.error('Mes final inválido');
    return;
  }

  const inicio = new Date(`${mesInicio}-01`);
  const fin = new Date(`${mesFin}-01`);

  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
    toast.error('Mes final inválido');
    return;
  }

  if (fin < inicio) {
    toast.error('Mes final inválido');
    return;
  }

  const ultimoDia = new Date(
    fin.getFullYear(),
    fin.getMonth() + 1,
    0
  ).getDate();

  const fechaInicio = `${mesInicio}-01`;
  const fechaFin = `${mesFin}-${String(ultimoDia).padStart(2, '0')}`;

  try {
    setLoading(true);

    const res = await api.post('/nomina', {
      tipo_periodo: tipoPeriodo,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      estado: 'abierta',
    });

    const data = Array.isArray(res.data) ? res.data : [res.data];

    if (!data || data.length === 0) {
      toast.error('No se creó la nómina');
      return;
    }

    const nominaSeleccionada = String(
      data[data.length - 1]?.id || data[0]?.id
    );

    setNominaId(nominaSeleccionada);

    toast.success(
      data.length > 1
        ? `Se generaron ${data.length} nóminas`
        : 'Nómina generada'
    );

    await cargarDatos();
    await cargarDetalles(nominaSeleccionada);
  } catch (error) {
    console.error(error);
    toast.error('Error al crear nómina');
  } finally {
    setLoading(false);
  }
};

const agregarDetalle = async () => {
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


  const agregarTodosEmpleados = async () => {
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
    periodo,
    setPeriodo,
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
    setMesInicio,
    mesInicio,
    setMesFin,
    mesFin,

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

    loading,

    crearNomina,
    agregarDetalle,
    cargarDetalles,
    cambiarEstado,

    estadoActual,
    setEstadoActual,

    resumen,
    generarPdf,
    generarPdfEmpleado,
    eliminarEmpleadoDeNomina,
    agregarTodosEmpleados,
  };
}