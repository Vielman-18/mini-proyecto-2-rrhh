import { Module } from '@nestjs/common';
import { NominaModule } from './nomina/nomina.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [NominaModule],
  providers: [PrismaService],
})
export class AppModule {}