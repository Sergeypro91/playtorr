import { RMQModule } from 'nestjs-rmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getMongoConfig, getRMQConfig } from '@app/common/configs';
import { WebtorrentController } from './webtorrent.controller';
import { WebtorrentService } from './webtorrent.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WebTorrentRepository } from './repositories';
import { WebTorrent, WebTorrentSchema } from './models';

@Module({
	controllers: [WebtorrentController],
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				'../envs/.env', // if we`re running service local not in docker
				'../envs/local.env', // if we`re running service local not in docker
				'./apps/webtorrent/envs/.env',
				`${process.env.NODE_ENV}.env`,
			],
		}),
		RMQModule.forRootAsync(getRMQConfig()),
		MongooseModule.forRootAsync(getMongoConfig()),
		MongooseModule.forFeature([
			{ name: WebTorrent.name, schema: WebTorrentSchema },
		]),
	],
	providers: [WebtorrentService, WebTorrentRepository],
})
export class WebtorrentModule {}
