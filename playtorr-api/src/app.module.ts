import {
	Module,
	Inject,
	Logger,
	NestModule,
	MiddlewareConsumer,
} from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { RedisModule } from './redis/redis.module';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMongoConfig } from './configs/mongo.config';
import { getTelegramConfig } from './configs/telegram.config';
import { REDIS } from './redis/redis.constants';
import * as RedisStore from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';
import { RedisClient } from 'redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	controllers: [AppController],
	imports: [
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		RedisModule,
		AuthModule,
		UserModule,
		TelegramModule.forRootAsync({
			imports: [ConfigModule, UserModule, AuthModule],
			inject: [ConfigService],
			useFactory: getTelegramConfig,
		}),
	],
	providers: [AppService, Logger],
})
export class AppModule implements NestModule {
	constructor(@Inject(REDIS) private readonly redis: RedisClient) {}
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(
				session({
					store: new (RedisStore(session))({
						client: this.redis,
						logErrors: true,
					}),
					saveUninitialized: false,
					secret: 'sup3rs3cr3t',
					resave: false,
					cookie: {
						sameSite: true,
						httpOnly: false,
						maxAge: 60000,
					},
				}),
				passport.initialize(),
				passport.session(),
			)
			.forRoutes('*');
	}
}
