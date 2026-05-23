import { Module } from '@nestjs/common';
import { PuestosController } from './puestos.controller';
import { PuestosService } from './puestos.service';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],

  controllers: [PuestosController],

  providers: [PuestosService],
})
export class PuestosModule {}