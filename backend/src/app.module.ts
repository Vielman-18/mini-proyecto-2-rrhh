import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { ValidacionModule } from './validacion/validacion.module';

@Module({
  imports: [AuthModule, EmpleadosModule, ValidacionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}