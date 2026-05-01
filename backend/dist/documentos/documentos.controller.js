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
const multer_1 = require("multer");
const path_1 = require("path");
const swagger_1 = require("@nestjs/swagger");
const documentos_service_1 = require("./documentos.service");
const crear_documento_dto_1 = require("./dto/crear-documento.dto");
let DocumentosController = class DocumentosController {
    documentosService;
    constructor(documentosService) {
        this.documentosService = documentosService;
    }
    async subirArchivo(file, body) {
        return await this.documentosService.guardarDocumento(file, body);
    }
    async listarPorEmpleado(id) {
        return await this.documentosService.listarPorEmpleado(id);
    }
};
exports.DocumentosController = DocumentosController;
__decorate([
    (0, common_1.Post)('subir'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                archivo: { type: 'string', format: 'binary' },
                empleado_id: { type: 'number', example: 1 },
                usuario_id: { type: 'number', example: 1 },
                tipo_documento: { type: 'string', example: 'DPI' },
            },
            required: ['archivo', 'empleado_id', 'usuario_id', 'tipo_documento'],
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('archivo', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, callback) => {
                const nombreArchivo = `${Date.now()}${(0, path_1.extname)(file.originalname)}`;
                callback(null, nombreArchivo);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (file.mimetype !== 'application/pdf') {
                return callback(new Error('Solo se permiten archivos PDF'), false);
            }
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, crear_documento_dto_1.CrearDocumentoDto]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "subirArchivo", null);
__decorate([
    (0, common_1.Get)('empleado/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "listarPorEmpleado", null);
exports.DocumentosController = DocumentosController = __decorate([
    (0, swagger_1.ApiTags)('Documentos'),
    (0, common_1.Controller)('documentos'),
    __metadata("design:paramtypes", [documentos_service_1.DocumentosService])
], DocumentosController);
//# sourceMappingURL=documentos.controller.js.map