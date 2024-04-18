import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Sail-X API')
    .setDescription('UVIMCO Case Study API Documentation')
    .addBearerAuth()
    .setVersion('0.0.1')
    .addServer(process.env.SERVER)
    .build();

  /**
   * Initilize OpenApi swagger docs
   */
  const SwaggerDocument = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, SwaggerDocument);
  await app.listen(3000);
}
bootstrap();
