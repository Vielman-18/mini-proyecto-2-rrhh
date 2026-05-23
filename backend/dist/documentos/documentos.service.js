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
exports.DocumentosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DocumentosService = class DocumentosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async guardarDocumento(file, body) {
        if (!file) {
            throw new common_1.BadRequestException('Debe subir un archivo PDF');
        }
        return this.prisma.documentos.create({
            data: {
                empleado_id: Number(body.empleado_id),
                usuario_id: Number(body.usuario_id),
                nombre_archivo: file.originalname,
                ruta_archivo: file.originalname,
                tipo_documento: body.tipo_documento,
                archivo_binario: file.buffer,
            },
        });
    }
    async listarPorEmpleado(empleadoId) {
        return this.prisma.documentos.findMany({
            where: {
                empleado_id: empleadoId,
            },
            orderBy: {
                fecha_carga: 'desc',
            },
            select: {
                id: true,
                nombre_archivo: true,
                tipo_documento: true,
                fecha_carga: true,
                empleado_id: true,
                usuario_id: true,
                ruta_archivo: true,
            },
        });
    }
    async obtenerArchivo(id) {
        const doc = await this.prisma.documentos.findUnique({
            where: { id },
            select: {
                archivo_binario: true,
                nombre_archivo: true,
                tipo_documento: true,
            },
        });
        if (!doc || !doc.archivo_binario) {
            throw new common_1.BadRequestException('Archivo no encontrado');
        }
        return doc;
    }
};
exports.DocumentosService = DocumentosService;
exports.DocumentosService = DocumentosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentosService);
//# sourceMappingURL=documentos.service.js.map