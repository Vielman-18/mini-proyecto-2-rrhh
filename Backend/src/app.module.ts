import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AcademicoModule } from './academico/academico.module';

@Module({
  imports: [ PrismaModule, AcademicoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
