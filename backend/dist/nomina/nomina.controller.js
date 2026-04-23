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
const nomina_service_1 = require("./nomina.service");
let NominaController = class NominaController {
    constructor(nominaService) {
        this.nominaService = nominaService;
    }
    // Crear una nueva nómina para un periodo
    async crear(periodo) {
        return this.nominaService.crearNomina(periodo);
    }
    // Listar todas las nóminas registradas
    async listar() {
        return this.nominaService.listarNominas();
    }
};
exports.NominaController = NominaController;
__decorate([
    (0, common_1.Post)('crear'),
    __param(0, (0, common_1.Body)('periodo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NominaController.prototype, "crear", null);
__decorate([
    (0, common_1.Get)('listar'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NominaController.prototype, "listar", null);
exports.NominaController = NominaController = __decorate([
    (0, common_1.Controller)('nomina'),
    __metadata("design:paramtypes", [nomina_service_1.NominaService])
], NominaController);
