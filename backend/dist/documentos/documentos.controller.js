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
exports.DocumentosController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const documentos_service_1 = require("./documentos.service");
const crear_documento_dto_1 = require("./dto/crear-documento.dto");
let DocumentosController = class DocumentosController {
    documentosService;
    constructor(documentosService) {
        this.documentosService = documentosService;
    }
    guardarDocumento(file, body) {
        return this.documentosService.guardarDocumento(file, body);
    }
    listarPorEmpleado(id) {
        return this.documentosService.listarPorEmpleado(id);
    }
    async descargarArchivo(id, res) {
        const doc = await this.documentosService.obtenerArchivo(id);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${doc.nombre_archivo}"`,
        });
        res.send(doc.archivo_binario);
    }
    eliminarDocumento(id) {
        return this.documentosService.eliminarDocumento(id);
    }
};
exports.DocumentosController = DocumentosController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('archivo')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, crear_documento_dto_1.CrearDocumentoDto]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "guardarDocumento", null);
__decorate([
    (0, common_1.Get)('empleado/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "listarPorEmpleado", null);
__decorate([
    (0, common_1.Get)('archivo/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "descargarArchivo", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "eliminarDocumento", null);
exports.DocumentosController = DocumentosController = __decorate([
    (0, common_1.Controller)('expedientes'),
    __metadata("design:paramtypes", [documentos_service_1.DocumentosService])
], DocumentosController);
//# sourceMappingURL=documentos.controller.js.map