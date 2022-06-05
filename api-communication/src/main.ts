import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
//
async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.REDIS,
    // TODO pass url from .env
    options: { url: 'redis://localhost:6379' },
  });

  await app.listen();
}
bootstrap().then(() => {
  console.log('---------#|Start - COMMUNICATION_SERVICE|#---------');
});
