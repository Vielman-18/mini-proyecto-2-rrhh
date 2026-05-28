import { Module } from '@nestjs/common';
import { HistorialNominaService } from './historial.service';
import { HistorialNominaController } from './historial.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [HistorialNominaController],
  providers: [
    HistorialNominaService,
    PrismaService,
  ],
})
export class HistorialNominaModule {}