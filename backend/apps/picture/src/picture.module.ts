import { RMQModule } from 'nestjs-rmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getMongoConfig, getRMQConfig } from '@app/common/configs';
import { MongooseModule } from '@nestjs/mongoose';
import {
	Picture,
	PictureSchema,
	Trend,
	TrendSchema,
	NetworkPicture,
	NetworkPictureSchema,
} from './models';
import { PictureController } from './picture.controller';
import { PictureService } from './picture.service';
import { PictureRepository } from './repositories/picture.repository';
import { TrendRepository } from './repositories/trend.repository';
import { NetworkPictureRepository } from './repositories/networkPicture.repository';

@Module({
	controllers: [PictureController],
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				'../envs/.env', // if we`re running service local not in docker
				'../envs/local.env', // if we`re running service local not in docker
				'./apps/picture/envs/.env',
				`${process.env.NODE_ENV}.env`,
			],
		}),
		RMQModule.forRootAsync(getRMQConfig()),
		MongooseModule.forRootAsync(getMongoConfig()),
		MongooseModule.forFeature([
			{ name: Picture.name, schema: PictureSchema },
		]),
		MongooseModule.forFeature([{ name: Trend.name, schema: TrendSchema }]),
		MongooseModule.forFeature([
			{ name: NetworkPicture.name, schema: NetworkPictureSchema },
		]),
	],
	providers: [
		PictureService,
		PictureRepository,
		TrendRepository,
		NetworkPictureRepository,
	],
})
export class PictureModule {}
