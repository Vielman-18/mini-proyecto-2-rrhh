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
const nomina_pdf_service_1 = require("../reportes/nomina-pdf/nomina-pdf.service");
let NominaService = class NominaService {
    prisma;
    nominaPdfService;
    constructor(prisma, nominaPdfService) {
        this.prisma = prisma;
        this.nominaPdfService = nominaPdfService;
    }
    async crearNomina(dto) {
        const inicio = new Date(dto.fecha_inicio);
        const fin = new Date(dto.fecha_fin);
        const nominas = [];
        if (dto.tipo_periodo === 'mensual') {
            let cursor = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
            while (cursor <= fin) {
                const year = cursor.getFullYear();
                const month = cursor.getMonth();
                const mesInicio = new Date(year, month, 1);
                const mesFin = new Date(year, month + 1, 0);
                const realInicio = mesInicio < inicio ? inicio : mesInicio;
                const realFin = mesFin > fin ? fin : mesFin;
                if (realInicio <= realFin) {
                    nominas.push(await this.prisma.nomina.create({
                        data: {
                            tipo_periodo: dto.tipo_periodo,
                            periodo: `${year}-${month + 1}`,
                            fecha_inicio: realInicio,
                            fecha_fin: realFin,
                            estado: dto.estado || 'abierta',
                        },
                    }));
                }
                cursor = new Date(year, month + 1, 1);
            }
            return nominas;
        }
        if (dto.tipo_periodo === 'quincenal') {
            let cursor = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
            while (cursor <= fin) {
                const year = cursor.getFullYear();
                const month = cursor.getMonth();
                const q1Start = new Date(year, month, 1);
                const q1End = new Date(year, month, 15);
                const q2Start = new Date(year, month, 16);
                const q2End = new Date(year, month + 1, 0);
                if (q1End >= inicio && q1Start <= fin) {
                    nominas.push(await this.prisma.nomina.create({
                        data: {
                            tipo_periodo: dto.tipo_periodo,
                            periodo: `${year}-${month + 1}-Q1`,
                            fecha_inicio: q1Start < inicio ? inicio : q1Start,
                            fecha_fin: q1End > fin ? fin : q1End,
                            estado: dto.estado || 'abierta',
                        },
                    }));
                }
                if (q2End >= inicio && q2Start <= fin) {
                    nominas.push(await this.prisma.nomina.create({
                        data: {
                            tipo_periodo: dto.tipo_periodo,
                            periodo: `${year}-${month + 1}-Q2`,
                            fecha_inicio: q2Start < inicio ? inicio : q2Start,
                            fecha_fin: q2End > fin ? fin : q2End,
                            estado: dto.estado || 'abierta',
                        },
                    }));
                }
                cursor = new Date(year, month + 1, 1);
            }
            return nominas;
        }
        const nomina = await this.prisma.nomina.create({
            data: {
                tipo_periodo: dto.tipo_periodo,
                periodo: dto.periodo,
                fecha_inicio: inicio,
                fecha_fin: fin,
                estado: dto.estado || 'abierta',
            },
        });
        return [nomina];
    }
    async listarNominas() {
        return this.prisma.nomina.findMany({
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
        if (!empleado)
            throw new common_1.NotFoundException('Empleado no encontrado');
        const nominaExiste = await this.prisma.nomina.findUnique({
            where: { id: dto.nomina_id },
        });
        if (!nominaExiste)
            throw new common_1.NotFoundException('Nómina no encontrada');
        const parametros = await this.prisma.parametros_nomina.findMany({
            where: { activo: true },
        });
        const igssPorcentaje = Number(parametros.find(p => p.nombre.toUpperCase() === 'IGSS')?.valor) || 0;
        const irtraPorcentaje = Number(parametros.find(p => p.nombre.toUpperCase() === 'IRTRA')?.valor) || 0;
        const salarioBase = Number(dto.salario_base || empleado.salario || 0);
        const horasExtra = Number(dto.horas_extra || 0);
        const bonificaciones = Number(dto.bonificaciones || 0);
        const comisiones = Number(dto.comisiones || 0);
        const deducciones = Number(dto.deducciones || 0);
        const descuentosLegales = Number(dto.descuentos_legales || 0);
        const pagoHora = salarioBase / 30 / 8;
        const montoHorasExtra = horasExtra * pagoHora * 1.5;
        const ingresoGravable = salarioBase +
            montoHorasExtra +
            bonificaciones +
            comisiones;
        const igss = ingresoGravable * (igssPorcentaje / 100);
        const irtra = ingresoGravable * (irtraPorcentaje / 100);
        const salarioFinal = ingresoGravable -
            deducciones -
            descuentosLegales -
            igss;
        return this.prisma.detalle_nomina.create({
            data: {
                nomina_id: dto.nomina_id,
                empleado_id: dto.empleado_id,
                salario_base: salarioBase,
                horas_trabajadas: dto.horas_trabajadas || 0,
                horas_extra: horasExtra,
                monto_horas_extra: montoHorasExtra,
                bonificaciones,
                comisiones,
                deducciones,
                descuentos_legales: descuentosLegales,
                igss,
                irtra,
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
            include: {
                empleados: true,
            },
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