import { Module } from '@nestjs/common';
import { ValidacionService } from './validacion.service';
import { ValidacionController } from './validacion.controller';

@Module({
  providers: [ValidacionService],
  controllers: [ValidacionController]
})
export class ValidacionModule {}
