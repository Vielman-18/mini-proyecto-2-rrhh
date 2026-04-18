import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
<<<<<<< HEAD:Backend/src/app.module.ts
import { EmpleadosModule } from './empleados/empleados.module';

@Module({
  imports: [EmpleadosModule],
=======
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
>>>>>>> 213899a0edbb005898b2458b5202f415c7367a3e:backend/src/app.module.ts
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}