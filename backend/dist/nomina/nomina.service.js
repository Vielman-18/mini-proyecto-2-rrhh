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
let NominaService = class NominaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async crearNomina(dto) {
        return await this.prisma.nomina.create({
            data: {
                tipo_periodo: dto.tipo_periodo,
                periodo: dto.periodo,
                fecha_inicio: new Date(dto.fecha_inicio),
                fecha_fin: new Date(dto.fecha_fin),
                estado: dto.estado || 'abierta',
            },
        });
    }
    async listarNominas() {
        return await this.prisma.nomina.findMany({
            orderBy: {
                fecha_creacion: 'desc',
            },
            include: {
                detalle_nomina: {
                    include: {
                        empleados: true,
                    },
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
        const nominaExiste = await this.prisma.nomina.findUnique({
            where: { id: dto.nomina_id },
        });
        if (!nominaExiste) {
            throw new common_1.NotFoundException('Nómina no encontrada');
        }
        const parametros = await this.prisma.parametros_nomina.findMany({
            where: { activo: true },
        });
        const igssPorcentaje = Number(parametros.find((p) => p.nombre.toUpperCase() === 'IGSS')?.valor || 0);
        const irtraPorcentaje = Number(parametros.find((p) => p.nombre.toUpperCase() === 'IRTRA')?.valor || 0);
        const salarioBase = Number(dto.salario_base);
        const horasTrabajadas = Number(dto.horas_trabajadas || 0);
        const horasExtra = Number(dto.horas_extra || 0);
        const bonificaciones = Number(dto.bonificaciones || 0);
        const comisiones = Number(dto.comisiones || 0);
        const deducciones = Number(dto.deducciones || 0);
        const descuentosLegales = Number(dto.descuentos_legales || 0);
        const pagoHora = salarioBase / 30 / 8;
        const montoHorasExtra = horasExtra * pagoHora * 1.5;
        const igss = salarioBase * (igssPorcentaje / 100);
        const irtra = salarioBase * (irtraPorcentaje / 100);
        const salarioFinal = salarioBase +
            montoHorasExtra +
            bonificaciones +
            comisiones -
            deducciones -
            descuentosLegales -
            igss -
            irtra;
        return await this.prisma.detalle_nomina.create({
            data: {
                nomina_id: dto.nomina_id,
                empleado_id: dto.empleado_id,
                salario_base: salarioBase,
                horas_trabajadas: horasTrabajadas,
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
        return await this.prisma.detalle_nomina.findMany({
            where: {
                nomina_id: nominaId,
            },
            include: {
                empleados: true,
                ajustes_nomina: true,
            },
            orderBy: {
                id: 'desc',
            },
        });
    }
};
exports.NominaService = NominaService;
exports.NominaService = NominaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NominaService);
//# sourceMappingURL=nomina.service.js.map