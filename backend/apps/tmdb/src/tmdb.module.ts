import { RMQModule } from 'nestjs-rmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getRMQConfig } from '@app/common';
import { TmdbController } from './tmdb.controller';
import { TmdbService } from './tmdb.service';

@Module({
	controllers: [TmdbController],
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				'../envs/.env', // if we`re running service local not in docker
				'../envs/local.env', // if we`re running service local not in docker
				'./apps/tmdb/envs/.env',
				`${process.env.NODE_ENV}.env`,
			],
		}),
		RMQModule.forRootAsync(getRMQConfig()),
	],
	providers: [TmdbService],
})
export class TmdbModule {}
