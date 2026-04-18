import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { DocumentosService } from './documentos.service';

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  @Post('subir')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        archivo: { type: 'string', format: 'binary' },
        tipo_documento: { type: 'string', example: 'DPI' },
        empleado_id: { type: 'number', example: 1 },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('archivo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const nombre = Date.now() + extname(file.originalname);
          callback(null, nombre);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (file.mimetype !== 'application/pdf') {
          return callback(new Error('Solo se permiten PDFs'), false);
        }
        callback(null, true);
      },
    }),
  )
  async subirArchivo(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return await this.documentosService.guardarDocumento(file, body);
  }
}