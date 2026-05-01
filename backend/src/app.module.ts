import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { ValidacionModule } from './validacion/validacion.module';
import { ReportesModule } from './reportes/reportes.module';
import { NominaModule } from './nomina/nomina.module';
import { AcademicoModule } from './academico/academico.module'; 
import { DocumentosModule } from './documentos/documentos.module';

@Module({
  imports: [AuthModule, EmpleadosModule, ValidacionModule, ReportesModule, NominaModule, AcademicoModule, DocumentosModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}