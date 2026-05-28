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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NominaController = void 0;
const common_1 = require("@nestjs/common");
const crear_detalle_nomina_dto_1 = require("./dto/crear-detalle-nomina.dto");
const actualizar_detalle_nomina_dto_1 = require("./dto/actualizar-detalle-nomina.dto");
const nomina_service_1 = require("./nomina.service");
const crear_nomina_dto_1 = require("./dto/crear-nomina.dto");
const cambiar_estado_dto_1 = require("./dto/cambiar-estado.dto");
let NominaController = class NominaController {
    nominaService;
    constructor(nominaService) {
        this.nominaService = nominaService;
    }
    async agregarTodosEmpleadosANomina(id) {
        return this.nominaService.agregarTodosEmpleadosANomina(Number(id));
    }
    async agregarEmpleadosPorDepartamento(id, departamentoId) {
        return this.nominaService.agregarEmpleadosPorDepartamento(Number(id), Number(departamentoId));
    }
    async agregarEmpleadosPorPuesto(id, puestoId) {
        return this.nominaService.agregarEmpleadosPorPuesto(Number(id), Number(puestoId));
    }
    CrearDetalleNomina(dto) {
        return this.nominaService.crearDetalleNomina(dto);
    }
    async actualizarDetalleNomina(detalleId, dto) {
        return this.nominaService.actualizarDetalleNomina(Number(detalleId), dto);
    }
    async cambiarEstado(id, dto) {
        return this.nominaService.cambiarEstado(Number(id), dto.estado);
    }
    async generarBoletaEmpleado(id, res) {
        return this.nominaService.generarBoletaEmpleado(Number(id), res);
    }
    listarDetallePorNomina(id) {
        return this.nominaService.listarDetallePorNomina(Number(id));
    }
    async eliminarNomina(id) {
        await this.nominaService.eliminarNomina(Number(id));
    }
    crear(dto) {
        return this.nominaService.crearNomina(dto);
    }
    async generarPdf(id, res) {
        await this.nominaService.generarPdf(Number(id), res);
    }
    listar() {
        return this.nominaService.listarNominas();
    }
    eliminarEmpleadoDeNomina(nominaId, empleadoId) {
        return this.nominaService.eliminarEmpleadoDeNomina(Number(nominaId), Number(empleadoId));
    }
};
exports.NominaController = NominaController;
__decorate([
    (0, common_1.Post)(':id/agregar-todos'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NominaController.prototype, "agregarTodosEmpleadosANomina", null);
__decorate([
    (0, common_1.Post)(':id/departamento/:departamentoId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('departamentoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NominaController.prototype, "agregarEmpleadosPorDepartamento", null);
__decorate([
    (0, common_1.Post)(':id/puesto/:puestoId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('puestoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NominaController.prototype, "agregarEmpleadosPorPuesto", null);
__decorate([
    (0, common_1.Post)('detalle'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_detalle_nomina_dto_1.CrearDetalleNominaDto]),
    __metadata("design:returntype", void 0)
], NominaController.prototype, "CrearDetalleNomina", null);
__decorate([
    (0, common_1.Put)('detalle/:detalleId'),
    __param(0, (0, common_1.Param)('detalleId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, actualizar_detalle_nomina_dto_1.ActualizarDetalleNominaDto]),
    __metadata("design:returntype", Promise)
], NominaController.prototype, "actualizarDetalleNomina", null);
__decorate([
    (0, common_1.Put)(':id/estado'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cambiar_estado_dto_1.CambiarEstadoDto]),
    __metadata("design:returntype", Promise)
], NominaController.prototype, "cambiarEstado", null);
__decorate([
    (0, common_1.Get)('detalle/:id/pdf'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NominaController.prototype, "generarBoletaEmpleado", null);
__decorate([
    (0, common_1.Get)(':id/detalle'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NominaController.prototype, "listarDetallePorNomina", null);
__decorate([
    (0, common_1.Delete)(':id/delete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NominaController.prototype, "eliminarNomina", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_nomina_dto_1.CrearNominaDto]),
    __metadata("design:returntype", void 0)
], NominaController.prototype, "crear", null);
__decorate([
    (0, common_1.Get)(':id/pdf'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NominaController.prototype, "generarPdf", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NominaController.prototype, "listar", null);
__decorate([
    (0, common_1.Delete)(':nominaId/empleado/:empleadoId'),
    __param(0, (0, common_1.Param)('nominaId')),
    __param(1, (0, common_1.Param)('empleadoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], NominaController.prototype, "eliminarEmpleadoDeNomina", null);
exports.NominaController = NominaController = __decorate([
    (0, common_1.Controller)('nomina'),
    __metadata("design:paramtypes", [nomina_service_1.NominaService])
], NominaController);
//# sourceMappingURL=nomina.controller.js.map