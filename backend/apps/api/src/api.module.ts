import { RMQModule } from 'nestjs-rmq';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configSession, getRMQConfig } from '@app/common/configs';
import {
	TestController,
	AuthController,
	UsersController,
	MinIOController,
	ParserController,
	PersonController,
	PictureController,
	WebtorrentController,
	PublicPreviewController,
	ImageController,
} from './controllers';
import { RolesGuard } from './guards';
import { LoggerModule } from './logger/logger.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtService } from '@nestjs/jwt';

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
		PublicPreviewController,
		WebtorrentController,
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
	providers: [RolesGuard, JwtService],
})
export class ApiModule implements NestModule {
	constructor(private readonly configService: ConfigService) {}

	configure(consumer: MiddlewareConsumer) {
		return configSession(consumer, this.configService);
	}
}
