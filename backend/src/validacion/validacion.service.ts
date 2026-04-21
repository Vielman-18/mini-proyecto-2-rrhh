import { Injectable } from '@nestjs/common';

export interface DocumentoObligatorio {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface EstadoExpediente {
  empleadoId: number;
  estado: 'Completo' | 'Incompleto' | 'En proceso';
  documentosFaltantes: string[];
  documentosEntregados: string[];
}

@Injectable()
export class ValidacionService {
  private documentosObligatorios: DocumentoObligatorio[] = [
    { id: 1, nombre: 'Contrato firmado', descripcion: 'Contrato de trabajo firmado' },
    { id: 2, nombre: 'DPI', descripcion: 'Documento Personal de Identificación' },
    { id: 3, nombre: 'Antecedentes penales', descripcion: 'Certificado de antecedentes penales' },
    { id: 4, nombre: 'Antecedentes policiales', descripcion: 'Certificado de antecedentes policiales' },
    { id: 5, nombre: 'Certificado de estudio', descripcion: 'Título o certificado académico' },
  ];

  obtenerDocumentosObligatorios() {
    return this.documentosObligatorios;
  }

  agregarDocumentoObligatorio(nombre: string, descripcion: string) {
    const nuevo: DocumentoObligatorio = {
      id: this.documentosObligatorios.length + 1,
      nombre,
      descripcion,
    };
    this.documentosObligatorios.push(nuevo);
    return nuevo;
  }

  eliminarDocumentoObligatorio(id: number) {
    const index = this.documentosObligatorios.findIndex(d => d.id === id);
    if (index === -1) return { message: 'Documento no encontrado' };
    this.documentosObligatorios.splice(index, 1);
    return { message: 'Documento eliminado correctamente' };
  }

  validarExpediente(empleadoId: number, documentosEntregados: string[]): EstadoExpediente {
    const obligatorios = this.documentosObligatorios.map(d => d.nombre);
    const faltantes = obligatorios.filter(d => !documentosEntregados.includes(d));

    let estado: 'Completo' | 'Incompleto' | 'En proceso';
    if (faltantes.length === 0) {
      estado = 'Completo';
    } else if (documentosEntregados.length === 0) {
      estado = 'Incompleto';
    } else {
      estado = 'En proceso';
    }

    return {
      empleadoId,
      estado,
      documentosFaltantes: faltantes,
      documentosEntregados,
    };
  }
}