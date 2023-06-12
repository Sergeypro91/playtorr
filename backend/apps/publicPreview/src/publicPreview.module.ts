import { RMQModule } from 'nestjs-rmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getMongoConfig, getRMQConfig } from '@app/common/configs';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicPreviewController } from './publicPreview.controller';
import { PublicPreviewService } from './publicPreview.service';

@Module({
	controllers: [PublicPreviewController],
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				'../envs/.env', // if we`re running service local not in docker
				'../envs/local.env', // if we`re running service local not in docker
				'./apps/publicPreview/envs/.env',
				`${process.env.NODE_ENV}.env`,
			],
		}),
		RMQModule.forRootAsync(getRMQConfig()),
	],
	providers: [PublicPreviewService],
})
export class PublicPreviewModule {}
