import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AcademicoModule } from './academico/academico.module';
import { DocumentosModule } from './documentos/documentos.module';


@Module({
  imports: [ PrismaModule, AcademicoModule, DocumentosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
