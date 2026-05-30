import { Module } from '@nestjs/common';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { PrismaService } from '../prisma/prisma.service';
import { NominaPdfService } from './nomina-pdf/general-pdf.service';
import { DocumentosService } from './nomina-pdf/documento-pdf.service';



@Module({
  controllers: [ReportesController],
  providers: [NominaPdfService, DocumentosService, ReportesService, PrismaService],
  exports: [NominaPdfService, DocumentosService, ReportesService, PrismaService],
})
export class ReportesModule {}