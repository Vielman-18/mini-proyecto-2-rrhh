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
exports.EmpleadosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EmpleadosService = class EmpleadosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async crear(data) {
        const existe = await this.prisma.empleados.findUnique({
            where: { dpi: data.dpi }
        });
        if (existe)
            throw new common_1.ConflictException('Ya existe un empleado con ese DPI');
        return this.prisma.empleados.create({
            data: {
                nombres: data.nombres,
                apellidos: data.apellidos,
                dpi: data.dpi,
                fecha_nacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : null,
                direccion: data.direccion,
                telefono: data.telefono,
                salario: data.salario,
                cargo: data.cargo,
                departamento: data.departamento,
                estado: 'activo',
            }
        });
    }
    async listar() {
        return this.prisma.empleados.findMany({
            orderBy: { id: 'asc' }
        });
    }
    async buscarPorId(id) {
        const empleado = await this.prisma.empleados.findUnique({
            where: { id }
        });
        if (!empleado)
            throw new common_1.NotFoundException('Empleado no encontrado');
        return empleado;
    }
    async actualizar(id, data) {
        return this.prisma.empleados.update({
            where: { id },
            data: {
                nombres: data.nombres,
                apellidos: data.apellidos,
                direccion: data.direccion,
                telefono: data.telefono,
                salario: data.salario,
                cargo: data.cargo,
                departamento: data.departamento,
            }
        });
    }
    async eliminar(id) {
        await this.prisma.empleados.delete({ where: { id } });
        return { message: 'Empleado eliminado correctamente' };
    }
    async cambiarEstado(id, estado) {
        return this.prisma.empleados.update({
            where: { id },
            data: { estado }
        });
    }
};
exports.EmpleadosService = EmpleadosService;
exports.EmpleadosService = EmpleadosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmpleadosService);
//# sourceMappingURL=empleados.service.js.map