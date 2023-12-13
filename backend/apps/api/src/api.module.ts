import { join } from 'path';
import { RMQModule } from 'nestjs-rmq';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { getRMQConfig } from '@app/common/configs';
import { ServeStaticModule } from '@nestjs/serve-static';
import {
	TestController,
	AuthController,
	UsersController,
	MinIOController,
	ImageController,
	ParserController,
	PersonController,
	PictureController,
	WebtorrentController,
	PublicPreviewController,
} from './controllers';
import { ApiService } from './api.service';
import { LoggerModule } from './logger/logger.module';
import { AccessStrategy, RefreshStrategy, GoogleStrategy } from './strategies';

@Module({
	controllers: [
		TestController,
		ImageController,
		AuthController,
		UsersController,
		MinIOController,
		ParserController,
		PersonController,
		PictureController,
		WebtorrentController,
		PublicPreviewController,
	],
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				'../envs/.env', // if we`re running service local not in docker
				'../envs/local.env', // if we`re running service local not in docker
				`${process.env.NODE_ENV}.env`,
			],
		}),
		// TODO change ServerStatic on MinIO
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '../publicPreview', 'posters'),
			serveRoot: '/posters',
			exclude: ['/api/(.*)'],
		}),
		RMQModule.forRootAsync(getRMQConfig()),
		LoggerModule,
	],
	providers: [
		JwtService,
		ApiService,
		AccessStrategy,
		RefreshStrategy,
		GoogleStrategy,
	],
})
export class ApiModule {}
