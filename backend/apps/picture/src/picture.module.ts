import { Module } from '@nestjs/common';
import { PictureController } from './picture.controller';
import { PictureService } from './picture.service';
import { ConfigModule } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
import { getMongoConfig, getRMQConfig } from '@app/configs';
import { MongooseModule } from '@nestjs/mongoose';
import { Picture, PictureSchema } from './models';
import { PictureRepository } from './repositories/picture.repository';

@Module({
	controllers: [PictureController],
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['../envs/.env', './apps/parser/envs/.env'],
		}),
		RMQModule.forRootAsync(getRMQConfig()),
		MongooseModule.forRootAsync(getMongoConfig()),
		MongooseModule.forFeature([
			{ name: Picture.name, schema: PictureSchema },
		]),
	],
	providers: [PictureService, PictureRepository],
})
export class PictureModule {}
