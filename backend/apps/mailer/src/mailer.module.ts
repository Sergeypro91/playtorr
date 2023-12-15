import { Module } from '@nestjs/common';
import { RMQModule } from 'nestjs-rmq';
import { ConfigModule } from '@nestjs/config';
import { getRMQConfig } from '@app/common/configs';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';

@Module({
	controllers: [MailerController],
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				'../envs/.env', // if we`re running service local not in docker
				'../envs/local.env', // if we`re running service local not in docker
				'./apps/mailer/envs/.env',
				`${process.env.NODE_ENV}.env`,
			],
		}),
		RMQModule.forRootAsync(getRMQConfig()),
	],
	providers: [MailerService],
})
export class MailerModule {}
