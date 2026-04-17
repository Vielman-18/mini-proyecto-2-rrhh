import { Module } from '@nestjs/common';
import { DocumentosController } from './documentos.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], 
  controllers: [DocumentosController],
})
export class DocumentosModule {}