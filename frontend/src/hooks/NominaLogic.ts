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

const [puestoId, setPuestoId] = useState<string>('');
const [puestos, setPuestos] = useState<any[]>([]);
  const [confirmacionOpen, setConfirmacionOpen] = useState(false);
  const [confirmacionTitulo, setConfirmacionTitulo] = useState('');
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('');
  const [confirmacionAccion, setConfirmacionAccion] = useState<(() => Promise<void>) | null>(null);

  const normalizeEstadoNomina = (estado?: string) => {
    if (!estado || estado === 'abierta' || estado === 'activo') return 'activa';
    if (estado === 'inactiva') return 'procesada';
    return estado;
  };


const solicitarEliminarEmpleado = (empleadoId: number) => {
  if (!isNominaActiva(estadoActual)) {
    toast.error('Solo se pueden eliminar empleados de nóminas activas');
    return;
  }

  if (!nominaId) {
    toast.error('Selecciona una nómina');
    return;
  }

  setConfirmacionTitulo('Eliminar empleado');
  setConfirmacionMensaje('¿Deseas remover este empleado de la nómina?');

  setConfirmacionAccion(() => async () => {
    await eliminarEmpleadoDeNomina(empleadoId);
  });

  setConfirmacionOpen(true);
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

const actualizarEmpleadoNomina = async (
  detalleId: number,
  payload: {
    horas_trabajadas?: number;
    horas_extra?: number;
    bonificaciones?: number;
    comisiones?: number;
    deducciones?: number;
    descuentos_legales?: number;
  },
) => {
  if (!isNominaActiva(estadoActual)) {
    toast.error('Solo se pueden modificar empleados de nóminas activas');
    return false;
  }

  try {
    setLoading(true);

    await api.put(`/nomina/detalle/${detalleId}`, payload);
    toast.success('Detalle de nómina actualizado');

    if (nominaId) {
      await cargarDetalles(nominaId);
    }

    return true;
  } catch (error) {
    console.error(error);
    toast.error('Error al actualizar el detalle de nómina');
    return false;
  } finally {
    setLoading(false);
  }
};

const obtenerConteoEmpleadosPorPuesto = (
  puestoId: number,
) => {

  const empleadosDelPuesto = empleados.filter(
    (e: any) =>
      e.estado === 'activo' &&
      Number(e.puesto_id) === Number(puestoId)
  );

  const idsEnNomina = new Set(
    detalles.map((d) => d.empleado_id)
  );

  return empleadosDelPuesto.filter(
    (e) => !idsEnNomina.has(e.id)
  ).length;
};

// =========================
// EJECUTAR AGREGAR POR PUESTO
// =========================

const ejecutarAgregarPorPuesto = async (
  puestoId: number,
) => {

  try {

    setLoading(true);

    const res = await api.post(
      `/nomina/${nominaId}/puesto/${puestoId}`
    );

    toast.success(
      `Se agregaron ${res.data.total_agregados} empleados`
    );

    await cargarDetalles(nominaId);

    setConfirmacionOpen(false);

  } catch (error) {

    console.error(error);

    toast.error(
      'Error al agregar empleados por puesto'
    );

  } finally {

    setLoading(false);

  }
};

// =========================
// MÉTODO PRINCIPAL
// =========================

const agregarEmpleadosPorPuesto = async (
  puestoId: number,
) => {

  if (!isNominaActiva(estadoActual)) {
    toast.error(
      'Solo se pueden agregar empleados a nóminas activas'
    );
    return;
  }

  if (!nominaId) {
    toast.error('Selecciona una nómina');
    return;
  }

  const conteo =
    obtenerConteoEmpleadosPorPuesto(puestoId);

  if (conteo === 0) {
    toast.error(
      'No hay empleados disponibles en este puesto'
    );
    return;
  }

  const puestoNombre =
  `Puesto #${puestoId}`;

  setConfirmacionTitulo(
    `Agregar empleados de ${puestoNombre}`
  );

  setConfirmacionMensaje(
    `¿Deseas agregar ${conteo} empleado${conteo !== 1 ? 's' : ''} del puesto ${puestoNombre}?`
  );

  setConfirmacionAccion(
    () => async () =>
      await ejecutarAgregarPorPuesto(puestoId)
  );

  setConfirmacionOpen(true);
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
      const [emp, nom, deps, pues] = await Promise.all([
        api.get('/empleados'),
        api.get('/nomina'),
        api.get('/departamentos'),
        api.get('/puestos'),
      ]);

      const nominasNormalizadas = nom.data.map((nomina: Nomina) => ({
        ...nomina,
        estado: normalizeEstadoNomina(nomina.estado),
      }));

      console.log('Nóminas cargadas:', nominasNormalizadas);
      setEmpleados(emp.data.filter((e: Empleado) => e.estado === 'activo'));
      setNominas(nominasNormalizadas);
      setDepartamentos(deps.data || []);
      setPuestos(pues.data || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar datos');
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

const crearNomina = async (): Promise<boolean> => {
  try {
    setLoading(true);

    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const anioActual = String(ahora.getFullYear());
    const diaActual = ahora.getDate();

    const esMesActual =
      tipoPeriodo === 'quincenal' &&
      anio === anioActual &&
      ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'].indexOf(mes) === mesActual;

    const periodosACrear = tipoPeriodo === 'quincenal'
      ? esMesActual
        ? [
            `${mes}${anio}${diaActual > 15 ? 'Q2' : 'Q1'}`,
          ]
        : [`${mes}${anio}Q1`, `${mes}${anio}Q2`]
      : [`${mes}${anio}`];

    let ultimaNominaId = '';

    for (const p of periodosACrear) {
      const res = await api.post('/nomina', {
        tipo_periodo: tipoPeriodo,
        periodo: p,
        estado: 'activa',
      });

      const data = Array.isArray(res.data) ? res.data : [res.data];
      if (data && data.length > 0) {
        ultimaNominaId = String(data[data.length - 1]?.id || data[0]?.id);
      }
    }

    if (!ultimaNominaId) {
      toast.error('No se pudo crear la nómina');
      return false;
    }

    // Limpieza de estados
    setNominaId(ultimaNominaId);
    setMes('mayo');
    setAnio('2026');
    setQuincena('Q1'); 

    const mensajeExito =
      tipoPeriodo === 'quincenal'
        ? periodosACrear.length === 1
          ? `Se generó ${periodosACrear[0]} para ${mes} ${anio}`
          : `Se generaron Q1 y Q2 para ${mes} ${anio}`
        : 'Nómina generada con éxito';

    toast.success(mensajeExito);

    await cargarDatos();
    await cargarDetalles(ultimaNominaId);
    return true;
  } catch (error) {
    console.error(error);
    toast.error('Error al crear el periodo de nómina');
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

const detallesProcesados = useMemo(() => {
  return detalles.map((d: any) => {

    const salarioBase = Number(d.salario_base || 0);

    const valorHorasExtra = Number(
      d.monto_horas_extra ||
      d.valor_horas_extra ||
      0
    );
    const BONO_INCENTIVO = 250;

    const bonificaciones = Number(d.bonificaciones || 0);

    const comisiones = Number(d.comisiones || 0);

    const totalExtras =
      BONO_INCENTIVO +
      bonificaciones +
      comisiones +
      valorHorasExtra;


    const IGSS_RATE = 0.0483;

    const igss = salarioBase * IGSS_RATE;

    // DEDUCCIONES MANUALES
    const descuentosLegales = Number(
      d.descuentos_legales ||
      d.deducciones ||
      0
    );

    const IRTRA_RATE = 0.01;

    const irtraPatronal =
      salarioBase * IRTRA_RATE;

  
    const totalDeducciones =
      igss +
      descuentosLegales;

    const salarioFinal =
      salarioBase +
      totalExtras -
      totalDeducciones;

    return {
      ...d,

      // extras
      bono_incentivo: BONO_INCENTIVO,
      valor_horas_extra: valorHorasExtra,
      total_extras: totalExtras,

      // deducciones
      igss,
      descuentos_legales: descuentosLegales,
      deducciones: totalDeducciones,

      // patronal
      irtra_patronal: irtraPatronal,

      // final
      salario_final: salarioFinal,
    };
  });
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
  const obtenerConteoEmpleadosTodos = () => {
    const empleadosActivos = empleados.filter((e) => e.estado === 'activo');
    const idsEnNomina = new Set(detalles.map((d) => d.empleado_id));
    return empleadosActivos.filter((e) => !idsEnNomina.has(e.id)).length;
  };

  const ejecutarAgregarTodos = async () => {
    try {
      setLoading(true);
      const res = await api.post(`/nomina/${nominaId}/agregar-todos`);
      toast.success(`Se agregaron ${res.data.total_agregados} empleados`);
      await cargarDetalles(nominaId);
      setConfirmacionOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Error al agregar empleados');
    } finally {
      setLoading(false);
    }
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

    const conteo = obtenerConteoEmpleadosTodos();
    
    if (conteo === 0) {
      toast.error('No hay empleados disponibles para agregar');
      return;
    }

    setConfirmacionTitulo('Agregar Todos los Empleados');
    setConfirmacionMensaje(`¿Estás seguro que deseas agregar ${conteo} empleado${conteo !== 1 ? 's' : ''} a esta nómina?`);
    setConfirmacionAccion(() => ejecutarAgregarTodos);
    setConfirmacionOpen(true);
  };

  const obtenerConteoEmpleadosPorDepartamento = (deptId: number) => {
    const empleadosDelDept = empleados.filter(
      (e) => e.estado === 'activo' && e.departamento_id === deptId
    );
    const idsEnNomina = new Set(detalles.map((d) => d.empleado_id));
    return empleadosDelDept.filter((e) => !idsEnNomina.has(e.id)).length;
  };

  const ejecutarAgregarPorDepartamento = async (deptId: number) => {
    try {
      setLoading(true);
      const res = await api.post(`/nomina/${nominaId}/departamento/${deptId}`);
      toast.success(`Se agregaron ${res.data.total_agregados} empleados`);
      await cargarDetalles(nominaId);
      setConfirmacionOpen(false);
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

    const conteo = obtenerConteoEmpleadosPorDepartamento(departamentoId);
    const deptNombre = departamentos.find((d) => d.id === departamentoId)?.nombre || 'Departamento';
    
    if (conteo === 0) {
      toast.error('No hay empleados disponibles en este departamento para agregar');
      return;
    }

    setConfirmacionTitulo(`Agregar Empleados de ${deptNombre}`);
    setConfirmacionMensaje(`¿Estás seguro que deseas agregar ${conteo} empleado${conteo !== 1 ? 's' : ''} del departamento ${deptNombre} a esta nómina?`);
    setConfirmacionAccion(() => async () => await ejecutarAgregarPorDepartamento(departamentoId));
    setConfirmacionOpen(true);
  };

const solicitarEliminarNomina = (id: number) => {
  const nomina = nominas.find((n) => n.id === id);

  if (nomina && !isNominaActiva(nomina.estado)) {
    toast.error('Solo se pueden eliminar nóminas ACTIVA.');
    return;
  }

  const periodo = nomina?.periodo || `Nómina #${id}`;
  setConfirmacionTitulo('Eliminar Nómina');
  setConfirmacionMensaje(`¿Estás seguro que deseas eliminar la nómina de ${periodo}? Esta acción no se puede deshacer.`);

  setConfirmacionAccion(() => async () => {
    await eliminarNomina(id);
  });

  setConfirmacionOpen(true);
};

const eliminarNomina = async (id: number) => {
  try {
    setLoading(true);
    await api.delete(`/nomina/${id}/delete`);
    toast.success('Nómina eliminada');
    if (String(id) === nominaId) {
      setNominaId('');
    }
    await cargarDatos();
    setConfirmacionOpen(false);
  } catch (error) {
    console.error(error);
    toast.error('Error al eliminar la nómina');
  } finally {
    setLoading(false);
  }
};

  return {
    puestos,
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
    solicitarEliminarNomina,
    solicitarEliminarEmpleado,

    estadoActual,
    setEstadoActual,

    resumen,
    generarPdf,
    generarPdfEmpleado,
    eliminarEmpleadoDeNomina,
    actualizarEmpleadoNomina,
    agregarTodosEmpleados,
    agregarEmpleadosPorDepartamento,
    departamentos,

    // Modal de confirmación
    confirmacionOpen,
    setConfirmacionOpen,
    confirmacionTitulo,
    confirmacionMensaje,
    confirmacionAccion,
    detallesProcesados,

    agregarEmpleadosPorPuesto,
  };
}