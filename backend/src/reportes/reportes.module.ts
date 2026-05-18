import { Module } from '@nestjs/common';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { PrismaService } from '../prisma/prisma.service';
import { NominaPdfService } from './nomina-pdf/nomina-pdf.service';

@Module({
  providers: [NominaPdfService],
  exports: [NominaPdfService],
})
export class ReportesModule {}