"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const empleados_module_1 = require("./empleados/empleados.module");
const reportes_module_1 = require("./reportes/reportes.module");
const nomina_module_1 = require("./nomina/nomina.module");
const academico_module_1 = require("./academico/academico.module");
const documentos_module_1 = require("./documentos/documentos.module");
const departamentos_module_1 = require("./departamentos/departamentos.module");
const puestos_module_1 = require("./puestos/puestos.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, empleados_module_1.EmpleadosModule, reportes_module_1.ReportesModule, nomina_module_1.NominaModule, academico_module_1.AcademicoModule, documentos_module_1.DocumentosModule, departamentos_module_1.DepartamentosModule, puestos_module_1.PuestosModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map