import { Module } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { EmpleadosController } from './empleados.controller';

@Module({
  providers: [EmpleadosService],
  controllers: [EmpleadosController]
})
export class EmpleadosModule {}
