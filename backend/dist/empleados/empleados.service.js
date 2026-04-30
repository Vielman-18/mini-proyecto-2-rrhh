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
exports.EmpleadosService = exports.EstadoLaboral = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
var EstadoLaboral;
(function (EstadoLaboral) {
    EstadoLaboral["ACTIVO"] = "activo";
    EstadoLaboral["INACTIVO"] = "inactivo";
    EstadoLaboral["SUSPENDIDO"] = "suspendido";
    EstadoLaboral["DESPEDIDO"] = "despedido";
})(EstadoLaboral || (exports.EstadoLaboral = EstadoLaboral = {}));
let EmpleadosService = class EmpleadosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async crear(dto) {
        return this.prisma.empleados.create({
            data: {
                nombres: dto.nombres,
                apellidos: dto.apellidos,
                dpi: dto.dpi,
                fecha_nacimiento: dto.fechaNacimiento
                    ? new Date(dto.fechaNacimiento)
                    : null,
                direccion: dto.direccion,
                telefono: dto.telefono,
                salario: dto.salario,
                cargo: dto.cargo,
                departamento: dto.departamento,
                estado: EstadoLaboral.ACTIVO,
            },
        });
    }
    async listar() {
        return this.prisma.empleados.findMany({
            orderBy: {
                id: 'asc',
            },
        });
    }
    async buscarPorId(id) {
        const empleado = await this.prisma.empleados.findUnique({
            where: { id },
        });
        if (!empleado) {
            throw new common_1.NotFoundException('Empleado no encontrado');
        }
        return empleado;
    }
    async actualizar(id, dto) {
        await this.buscarPorId(id);
        return this.prisma.empleados.update({
            where: { id },
            data: {
                nombres: dto.nombres,
                apellidos: dto.apellidos,
                dpi: dto.dpi,
                fecha_nacimiento: dto.fechaNacimiento
                    ? new Date(dto.fechaNacimiento)
                    : undefined,
                direccion: dto.direccion,
                telefono: dto.telefono,
                salario: dto.salario,
                cargo: dto.cargo,
                departamento: dto.departamento,
            },
        });
    }
    async eliminar(id) {
        await this.buscarPorId(id);
        return this.prisma.empleados.delete({
            where: { id },
        });
    }
    async cambiarEstado(id, estado) {
        await this.buscarPorId(id);
        return this.prisma.empleados.update({
            where: { id },
            data: {
                estado,
            },
        });
    }
};
exports.EmpleadosService = EmpleadosService;
exports.EmpleadosService = EmpleadosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmpleadosService);
//# sourceMappingURL=empleados.service.js.map