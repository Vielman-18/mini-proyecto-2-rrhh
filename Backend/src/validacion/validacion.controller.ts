import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ValidacionService } from './validacion.service';

class AgregarDocumentoDto {
  nombre: string;
  descripcion: string;
}

class ValidarExpedienteDto {
  empleadoId: number;
  documentosEntregados: string[];
}

@Controller('validacion')
export class ValidacionController {
  constructor(private validacionService: ValidacionService) {}

  @Get('documentos-obligatorios')
  obtenerDocumentosObligatorios() {
    return this.validacionService.obtenerDocumentosObligatorios();
  }

  @Post('documentos-obligatorios')
  agregarDocumentoObligatorio(@Body() dto: AgregarDocumentoDto) {
    return this.validacionService.agregarDocumentoObligatorio(dto.nombre, dto.descripcion);
  }

  @Delete('documentos-obligatorios/:id')
  eliminarDocumentoObligatorio(@Param('id', ParseIntPipe) id: number) {
    return this.validacionService.eliminarDocumentoObligatorio(id);
  }

  @Post('expediente')
  validarExpediente(@Body() dto: ValidarExpedienteDto) {
    return this.validacionService.validarExpediente(dto.empleadoId, dto.documentosEntregados);
  }
}