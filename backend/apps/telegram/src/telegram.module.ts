import { RMQModule } from 'nestjs-rmq';
import { LoggerModule } from 'nestjs-pino';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getRMQConfig, getPinoConfig } from '@app/common';
import { TelegramService } from './telegram.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['../envs/.env', './apps/telegram/envs/.env'],
		}),
		RMQModule.forRootAsync(getRMQConfig()),
		LoggerModule.forRootAsync(getPinoConfig()),
	],
	providers: [TelegramService],
})
export class TelegramModule {}
