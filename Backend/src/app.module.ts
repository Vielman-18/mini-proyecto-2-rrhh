import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpleadosModule } from './empleados/empleados.module';

@Module({
  imports: [EmpleadosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}