import { Module } from '@nestjs/common';
import { EmpleadosController } from './empleados.controller';
import { EmpleadosService } from './empleados.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [EmpleadosController],
  providers: [EmpleadosService, PrismaService],
})
export class EmpleadosModule {}
