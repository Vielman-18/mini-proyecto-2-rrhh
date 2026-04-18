import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { EmpleadosModule } from './empleados/empleados.module';
import { PrismaModule } from './prisma/prisma.module';
import { DocumentosModule } from './documentos/documentos.module';

@Module({
  imports: [EmpleadosModule, PrismaModule, DocumentosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}