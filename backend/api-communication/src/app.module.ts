import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '../../.env' }),
    ClientsModule.register([
      {
        name: 'MAIN_API',
        transport: Transport.REDIS,
        options: { url: 'redis://localhost:6379' },
      },
      {
        name: 'MOVIE_PROCESSIONING',
        transport: Transport.REDIS,
        options: { url: 'redis://localhost:6379' },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
