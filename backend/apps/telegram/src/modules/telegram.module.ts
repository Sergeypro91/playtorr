import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from '@app/configs';
import { TelegramService } from './telegram.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['../envs/.env', './apps/telegram/src/envs/.env'],
		}),
		RMQModule.forRootAsync(getRMQConfig()),
	],
	providers: [TelegramService],
})
export class TelegramModule {}
