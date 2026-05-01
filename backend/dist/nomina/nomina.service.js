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
        });
    }
};
exports.NominaService = NominaService;
exports.NominaService = NominaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NominaService);
//# sourceMappingURL=nomina.service.js.map