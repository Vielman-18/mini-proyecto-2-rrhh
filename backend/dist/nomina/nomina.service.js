"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NominaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crear_nomina_dto_1 = require("./dto/crear-nomina.dto");
const nomina_pdf_service_1 = require("../reportes/nomina-pdf/nomina-pdf.service");
let NominaService = class NominaService {
    prisma;
    nominaPdfService;
    constructor(prisma, nominaPdfService) {
        this.prisma = prisma;
        this.nominaPdfService = nominaPdfService;
    }
    async agregarTodosEmpleadosANomina(nominaId) {
        const nomina = await this.prisma.nomina.findUnique({
            where: { id: nominaId },
        });
        if (!nomina) {
            throw new common_1.NotFoundException('Nómina no encontrada');
        }
        const empleados = await this.prisma.empleados.findMany({
            where: { estado: 'activo' },
        });
        const parametros = await this.prisma.parametros_nomina.findMany({
            where: { activo: true },
        });
        const igssPorcentaje = Number(parametros.find(p => p.nombre?.toUpperCase() === 'IGSS')?.valor) || 4.83;
        const irtraPorcentaje = Number(parametros.find(p => p.nombre?.toUpperCase() === 'IRTRA')?.valor) || 1;
        const resultados = [];
        for (const empleado of empleados) {
            const existeDetalle = await this.prisma.detalle_nomina.findFirst({
                where: {
                    nomina_id: nominaId,
                    empleado_id: empleado.id,
                },
            });
            if (existeDetalle)
                continue;
            const salarioMensual = Number(empleado.salario);
            let salarioBase = salarioMensual;
            if (nomina.tipo_periodo === 'quincenal') {
                salarioBase = salarioMensual / 2;
            }
            const valorHora = salarioMensual / 240;
            const ingresoGravable = salarioBase;
            const igss = ingresoGravable * (igssPorcentaje / 100);
            const irtra = ingresoGravable * (irtraPorcentaje / 100);
            const deducciones = igss + irtra;
            const salarioFinal = ingresoGravable - deducciones;
            const detalle = await this.prisma.detalle_nomina.create({
                data: {
                    nomina_id: nominaId,
                    empleado_id: empleado.id,
                    salario_base: salarioBase,
                    horas_extra: 0,
                    monto_horas_extra: 0,
                    bonificaciones: 0,
                    comisiones: 0,
                    igss,
                    irtra,
                    descuentos_legales: 0,
                    deducciones,
                    salario_final: salarioFinal,
                },
            });
            resultados.push(detalle);
        }
        return {
            total_agregados: resultados.length,
            nomina_id: nominaId,
            detalles: resultados,
        };
    }
    async generarBoletaEmpleado(detalleId, res) {
        const detalle = await this.prisma.detalle_nomina.findUnique({
            where: { id: detalleId },
            include: {
                empleados: true,
                nomina: true,
            },
        });
        if (!detalle) {
            throw new common_1.NotFoundException('Detalle de nómina no encontrado');
        }
        return this.nominaPdfService.generarBoletaEmpleado(detalle, res);
    }
    parsePeriodo(periodo, tipoPeriodo) {
        const normalized = periodo.trim().toLowerCase().replace(/\s+/g, '');
        const meses = {
            enero: 1,
            febrero: 2,
            marzo: 3,
            abril: 4,
            mayo: 5,
            junio: 6,
            julio: 7,
            agosto: 8,
            septiembre: 9,
            octubre: 10,
            noviembre: 11,
            diciembre: 12,
        };
        const numericMatch = normalized.match(/^(\d{4})-?(\d{2})(?:-?q([12]))?$/i);
        const textMatch = normalized.match(/^([a-záéíóúñ]+)-?(\d{4})(?:-?q([12]))?$/i);
        let year;
        let month;
        let quincena;
        if (numericMatch) {
            year = Number(numericMatch[1]);
            month = Number(numericMatch[2]) - 1;
            if (numericMatch[3]) {
                quincena = `Q${numericMatch[3]}`;
            }
        }
        else if (textMatch) {
            const mesNombre = textMatch[1];
            const mesNumero = meses[mesNombre];
            if (!mesNumero) {
                throw new common_1.BadRequestException('Mes inválido en periodo. Use un mes válido como mayo, junio, etc.');
            }
            year = Number(textMatch[2]);
            month = mesNumero - 1;
            if (textMatch[3]) {
                quincena = `Q${textMatch[3]}`;
            }
        }
        else {
            throw new common_1.BadRequestException('Periodo inválido. Use mayo2026, 2026-05, mayo2026Q1 o 2026-05-Q1.');
        }
        if (month < 0 || month > 11) {
            throw new common_1.BadRequestException('Periodo inválido: mes fuera de rango.');
        }
        if (tipoPeriodo === crear_nomina_dto_1.TipoPeriodo.QUINCENAL && !quincena) {
            throw new common_1.BadRequestException('Para periodos quincenales debe indicar Q1 o Q2.');
        }
        if (tipoPeriodo === crear_nomina_dto_1.TipoPeriodo.MENSUAL && quincena) {
            throw new common_1.BadRequestException('Para periodos mensuales no use Q1 o Q2.');
        }
        const inicio = quincena === 'Q2'
            ? new Date(year, month, 16)
            : new Date(year, month, 1);
        const fin = quincena === 'Q1'
            ? new Date(year, month, 15)
            : new Date(year, month + 1, 0);
        const periodoCanon = tipoPeriodo === crear_nomina_dto_1.TipoPeriodo.MENSUAL
            ? `${year}-${String(month + 1).padStart(2, '0')}`
            : `${year}-${String(month + 1).padStart(2, '0')}-${quincena}`;
        return { inicio, fin, periodo: periodoCanon };
    }
    async crearNomina(dto) {
        const crear = async (data) => this.prisma.nomina.create({ data });
        let inicio;
        let fin;
        let periodo = dto.periodo?.trim();
        if (periodo) {
            const parsed = this.parsePeriodo(periodo, dto.tipo_periodo);
            inicio = parsed.inicio;
            fin = parsed.fin;
            periodo = parsed.periodo;
        }
        else {
            if (!dto.fecha_inicio || !dto.fecha_fin) {
                throw new common_1.BadRequestException('Debe enviar periodo o las fechas fecha_inicio y fecha_fin.');
            }
            inicio = new Date(dto.fecha_inicio);
            fin = new Date(dto.fecha_fin);
            periodo = dto.periodo || '';
        }
        if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
            throw new common_1.BadRequestException('Fechas inválidas para la nómina.');
        }
        if (inicio > fin) {
            throw new common_1.BadRequestException('La fecha_inicio no puede ser mayor que fecha_fin');
        }
        if (dto.periodo) {
            const nomina = await crear({
                tipo_periodo: dto.tipo_periodo,
                periodo,
                fecha_inicio: inicio,
                fecha_fin: fin,
                estado: dto.estado || 'abierta',
            });
            return [nomina];
        }
        if (dto.tipo_periodo === 'mensual') {
            const nominas = [];
            let cursor = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
            while (cursor <= fin) {
                const year = cursor.getFullYear();
                const month = cursor.getMonth();
                const mesInicio = new Date(year, month, 1);
                const mesFin = new Date(year, month + 1, 0);
                if (mesFin >= inicio && mesInicio <= fin) {
                    nominas.push(await crear({
                        tipo_periodo: dto.tipo_periodo,
                        periodo: `${year}-${String(month + 1).padStart(2, '0')}`,
                        fecha_inicio: mesInicio,
                        fecha_fin: mesFin,
                        estado: dto.estado || 'abierta',
                    }));
                }
                cursor = new Date(year, month + 1, 1);
            }
            return nominas;
        }
        if (dto.tipo_periodo === 'quincenal') {
            const nominas = [];
            let cursor = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
            while (cursor <= fin) {
                const year = cursor.getFullYear();
                const month = cursor.getMonth();
                const periodoBase = `${year}-${String(month + 1).padStart(2, '0')}`;
                const q1Start = new Date(year, month, 1);
                const q1End = new Date(year, month, 15);
                const q2Start = new Date(year, month, 16);
                const q2End = new Date(year, month + 1, 0);
                if (q1End >= inicio && q1Start <= fin) {
                    nominas.push(await crear({
                        tipo_periodo: dto.tipo_periodo,
                        periodo: `${periodoBase}-Q1`,
                        fecha_inicio: q1Start,
                        fecha_fin: q1End,
                        estado: dto.estado || 'abierta',
                    }));
                }
                if (q2End >= inicio && q2Start <= fin) {
                    nominas.push(await crear({
                        tipo_periodo: dto.tipo_periodo,
                        periodo: `${periodoBase}-Q2`,
                        fecha_inicio: q2Start,
                        fecha_fin: q2End,
                        estado: dto.estado || 'abierta',
                    }));
                }
                cursor = new Date(year, month + 1, 1);
            }
            return nominas;
        }
        const nomina = await crear({
            tipo_periodo: dto.tipo_periodo,
            periodo: dto.periodo,
            fecha_inicio: inicio,
            fecha_fin: fin,
            estado: dto.estado || 'abierta',
        });
        return [nomina];
    }
    async eliminarNomina(id) {
        const nomina = await this.prisma.nomina.findUnique({ where: { id } });
        if (!nomina) {
            throw new common_1.NotFoundException('Nómina no encontrada');
        }
        await this.prisma.nomina.update({
            where: { id },
            data: { estado: 'eliminada' },
        });
    }
    async cambiarEstado(id, estado) {
        const nomina = await this.prisma.nomina.findUnique({ where: { id } });
        if (!nomina) {
            throw new common_1.NotFoundException('Nómina no encontrada');
        }
        return this.prisma.nomina.update({
            where: { id },
            data: { estado },
        });
    }
    async eliminarEmpleadoDeNomina(nominaId, empleadoId) {
        const detalle = await this.prisma.detalle_nomina.findFirst({
            where: {
                nomina_id: nominaId,
                empleado_id: empleadoId,
            },
        });
        if (!detalle) {
            throw new common_1.NotFoundException('El empleado no está en esta nómina');
        }
        return this.prisma.detalle_nomina.delete({
            where: { id: detalle.id },
        });
    }
    async listarNominas() {
        return this.prisma.nomina.findMany({
            where: { NOT: { estado: 'eliminada' } },
            orderBy: { fecha_creacion: 'desc' },
            include: {
                detalle_nomina: {
                    include: { empleados: true },
                },
            },
        });
    }
    async crearDetalleNomina(dto) {
        const empleado = await this.prisma.empleados.findUnique({
            where: { id: dto.empleado_id },
        });
        if (!empleado) {
            throw new common_1.NotFoundException('Empleado no encontrado');
        }
        const nomina = await this.prisma.nomina.findUnique({
            where: { id: dto.nomina_id },
        });
        if (!nomina) {
            throw new common_1.NotFoundException('Nómina no encontrada');
        }
        const existeDetalle = await this.prisma.detalle_nomina.findFirst({
            where: {
                nomina_id: dto.nomina_id,
                empleado_id: dto.empleado_id,
            },
        });
        if (existeDetalle) {
            throw new common_1.BadRequestException('Este empleado ya está agregado en esta nómina');
        }
        const parametros = await this.prisma.parametros_nomina.findMany({
            where: { activo: true },
        });
        const igssPorcentaje = Number(parametros.find((p) => p.nombre?.toUpperCase() === 'IGSS')?.valor) || 4.83;
        const irtraPorcentaje = Number(parametros.find((p) => p.nombre?.toUpperCase() === 'IRTRA')?.valor) || 1;
        const salarioMensual = Number(empleado.salario);
        let salarioBase = salarioMensual;
        if (nomina.tipo_periodo === 'quincenal') {
            salarioBase = salarioMensual / 2;
        }
        const horasExtra = Number(dto.horas_extra || 0);
        const bonificaciones = Number(dto.bonificaciones || 0);
        const comisiones = Number(dto.comisiones || 0);
        const descuentosLegales = Number(dto.descuentos_legales || 0);
        const valorHora = nomina.tipo_periodo === 'quincenal'
            ? salarioMensual / 240
            : salarioMensual / 240;
        const montoHorasExtra = horasExtra * valorHora * 1.5;
        const ingresoGravable = salarioBase +
            montoHorasExtra +
            bonificaciones +
            comisiones;
        const igss = ingresoGravable * (igssPorcentaje / 100);
        const irtra = ingresoGravable * (irtraPorcentaje / 100);
        const deducciones = descuentosLegales +
            igss +
            irtra;
        const salarioFinal = ingresoGravable - deducciones;
        return this.prisma.detalle_nomina.create({
            data: {
                nomina_id: dto.nomina_id,
                empleado_id: dto.empleado_id,
                salario_base: salarioBase,
                horas_extra: horasExtra,
                monto_horas_extra: montoHorasExtra,
                bonificaciones,
                comisiones,
                igss,
                irtra,
                deducciones,
                descuentos_legales: descuentosLegales,
                salario_final: salarioFinal,
            },
        });
    }
    async listarDetallePorNomina(nominaId) {
        return this.prisma.detalle_nomina.findMany({
            where: { nomina_id: nominaId },
            include: { empleados: true },
            orderBy: { id: 'desc' },
        });
    }
    async generarPdf(nominaId, res) {
        const nomina = await this.prisma.nomina.findUnique({
            where: { id: nominaId },
        });
        if (!nomina) {
            throw new common_1.NotFoundException('Nómina no encontrada');
        }
        const detalles = await this.prisma.detalle_nomina.findMany({
            where: { nomina_id: nominaId },
            include: { empleados: true },
        });
        const totalPlanilla = detalles.reduce((acc, d) => acc + Number(d.salario_final || 0), 0);
        await this.prisma.logspdf.create({
            data: {
                nombre_archivo: `nomina_${nomina.periodo}.pdf`,
                nomina_id: nominaId,
                fecha_generacion: new Date(),
            },
        });
        return this.nominaPdfService.generar(nomina, detalles, totalPlanilla, res);
    }
};
exports.NominaService = NominaService;
exports.NominaService = NominaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        nomina_pdf_service_1.NominaPdfService])
], NominaService);
//# sourceMappingURL=nomina.service.js.map