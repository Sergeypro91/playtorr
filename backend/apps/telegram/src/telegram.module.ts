import { RMQModule } from 'nestjs-rmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getRMQConfig } from '@app/common';
import { TelegramService } from './telegram.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				'envs/.env',
				'envs/dev.env',
				'./apps/telegram/envs/.env',
				`${process.env.NODE_ENV}.env`,
			],
		}),
		RMQModule.forRootAsync(getRMQConfig()),
	],
	providers: [TelegramService],
})
export class TelegramModule {}
