import { RMQModule } from 'nestjs-rmq';
import * as createRedisStore from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { getRMQConfig } from '@app/common';
import {
	TestController,
	AuthController,
	UserController,
	MinIOController,
	ParserController,
	PictureController,
} from './controllers';
import Redis from 'ioredis';
import { JwtStrategy, LocalStrategy } from './strategies';
import { SessionSerializer } from './session';
import { RolesGuard } from './guards';
import { LoggerModule } from './logger/logger.module';

@Module({
	controllers: [
		TestController,
		AuthController,
		UserController,
		MinIOController,
		ParserController,
		PictureController,
	],
	imports: [
		ConfigModule.forRoot({ isGlobal: true, envFilePath: '../envs/.env' }),
		RMQModule.forRootAsync(getRMQConfig()),
		PassportModule.register({ session: true }),
		LoggerModule,
	],
	providers: [JwtStrategy, LocalStrategy, SessionSerializer, RolesGuard],
})
export class ApiModule implements NestModule {
	constructor(private readonly configService: ConfigService) {}
	configure(consumer: MiddlewareConsumer): any {
		const RedisStore = createRedisStore(session);
		const REDIS_PORT = parseInt(
			this.configService.get('REDIS_PORT', '6379'),
			10,
		);
		const REDIS_HOST = this.configService.get('REDIS_HOST', 'localhost');
		const REDIS_KEY = this.configService.get('REDIS_KEY', '');
		const REDIS_TTL = parseInt(
			this.configService.get('REDIS_TTL', '3600000'),
			10,
		);

		consumer
			.apply(
				session({
					store: new RedisStore({
						client: new Redis(REDIS_PORT, REDIS_HOST),
					}),
					secret: REDIS_KEY,
					resave: false,
					saveUninitialized: false,
					cookie: {
						sameSite: true,
						httpOnly: true,
						maxAge: REDIS_TTL,
					},
				}),
				passport.initialize(),
				passport.session(),
			)
			.forRoutes('*');
	}
}
