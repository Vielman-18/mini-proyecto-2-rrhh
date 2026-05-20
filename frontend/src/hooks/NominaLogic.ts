import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import type { Empleado, Nomina, DetalleNomina } from '../types/nomina';

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

  const [horasTrabajadas, setHorasTrabajadas] = useState(160);
  const [horasExtra, setHorasExtra] = useState(0);
  const [bonificaciones, setBonificaciones] = useState(0);
  const [comisiones, setComisiones] = useState(0);
  const [deducciones, setDeducciones] = useState(0);
  const [descuentosLegales, setDescuentosLegales] = useState(0);

  const [loading, setLoading] = useState(false);

  const cargarDetalles = async (id: string) => {
    try {
      const res = await api.get(`/nomina/${id}/detalle`);
      setDetalles(res.data);
    } catch {
      setDetalles([]);
    }
  };

  const cargarDatos = async () => {
    try {
      const [emp, nom] = await Promise.all([
        api.get('/empleados'),
        api.get('/nomina'),
      ]);

      setEmpleados(emp.data.filter((e: Empleado) => e.estado === 'activo'));
      setNominas(nom.data);
    } catch {
      toast.error('Error al cargar datos');
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const crearNomina = async () => {
    if (!periodo || !fechaInicio || !fechaFin) {
      toast.error('Completa los campos');
      return;
    }

    if (new Date(fechaFin) < new Date(fechaInicio)) {
      toast.error('Fechas inválidas');
      return;
    }

    try {
      setLoading(true);

      const res = await api.post('/nomina', {
        tipo_periodo: tipoPeriodo,
        periodo,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        estado: 'abierta',
      });

      const id = String(res.data.id);
      setNominaId(id);

      toast.success('Nómina creada');

      await cargarDatos();
      cargarDetalles(id);
    } catch {
      toast.error('Error al crear nómina');
    } finally {
      setLoading(false);
    }
  };

  const agregarDetalle = async () => {
    if (!nominaId || !empleadoId) {
      toast.error('Selecciona nómina y empleado');
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
        deducciones: Number(deducciones),
        descuentos_legales: Number(descuentosLegales),
      });

      toast.success('Empleado agregado');

      setEmpleadoId('');
      setHorasExtra(0);
      setBonificaciones(0);
      setComisiones(0);
      setDeducciones(0);
      setDescuentosLegales(0);

      cargarDetalles(nominaId);
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

    resumen,
  };
}