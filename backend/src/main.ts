import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
<<<<<<< HEAD:Backend/src/main.ts
  await app.listen(process.env.PORT ?? 3000);
=======

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API de RRHH')
    .setDescription('Documentación de endpoints del sistema RRHH')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
>>>>>>> 213899a0edbb005898b2458b5202f415c7367a3e:backend/src/main.ts
}
bootstrap();
