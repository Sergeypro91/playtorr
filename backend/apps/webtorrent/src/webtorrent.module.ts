import { RMQModule } from 'nestjs-rmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getRMQConfig } from '@app/common/configs';
import { WebtorrentController } from './webtorrent.controller';
import { WebtorrentService } from './webtorrent.service';

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
	],
	providers: [WebtorrentService],
})
export class WebtorrentModule {}
