import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: Number(configService.get('PORT')),
    },
  });
  await app.startAllMicroservices().then(() => {
    console.log(
      `Microservice is listening on port ${configService.get('PORT')}...`,
    );
  });
}

bootstrap();
