import { RMQModule } from 'nestjs-rmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig, getRMQConfig } from '@app/common';
import { ParserController } from './parser.controller';
import { ParserService } from './parser.service';
import { PictureTorrents, PictureTorrentsSchema } from './models';
import { PictureTorrentsRepository } from './repositories/pictureTorrents.repository';

@Module({
	controllers: [ParserController],
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				'../envs/.env', // if we`re running service local not in docker
				'../envs/local.env', // if we`re running service local not in docker
				'./apps/parser/envs/.env',
				`${process.env.NODE_ENV}.env`,
			],
		}),
		RMQModule.forRootAsync(getRMQConfig()),
		MongooseModule.forRootAsync(getMongoConfig()),
		MongooseModule.forFeature([
			{ name: PictureTorrents.name, schema: PictureTorrentsSchema },
		]),
	],
	providers: [ParserService, PictureTorrentsRepository],
})
export class ParserModule {}
