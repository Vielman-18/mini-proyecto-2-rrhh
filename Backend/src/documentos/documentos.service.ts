import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentosService {
  constructor(private readonly prisma: PrismaService) {}

  async guardarDocumento(file: Express.Multer.File, body: any) {
    return await this.prisma.documentos.create({
      data: {
        empleado_id: Number(body.empleado_id),
        usuario_id: 1,
        nombre_archivo: file.filename,
        ruta_archivo: file.path,
        tipo_documento: body.tipo_documento,
      }
    });
  }
}