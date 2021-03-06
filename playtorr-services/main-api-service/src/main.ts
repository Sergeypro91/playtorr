import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import * as RedisStore from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const logger = new Logger('App');
	const redisClient = new Redis();
	const configService = await app.get(ConfigService);
	const MAIN_API_PORT = Number(configService.get('MAIN_API_PORT'));
	const REDIS_KEY = configService.get('REDIS_KEY');
	const REDIS_TTL = Number(configService.get('REDIS_TTL'));

	app.setGlobalPrefix('api');
	app.use(
		session({
			store: new (RedisStore(session))({
				client: redisClient,
				logErrors: true,
			}),
			saveUninitialized: false,
			secret: REDIS_KEY,
			resave: false,
			cookie: {
				sameSite: true,
				httpOnly: false,
				maxAge: REDIS_TTL,
			},
		}),
		passport.initialize(),
		passport.session(),
	);

	await app.listen(MAIN_API_PORT, async () => {
		logger.log(`Application start on - ${await app.getUrl()}`);
	});
}

bootstrap().then(() => {
	console.log('---------#|Start - MAIN_API_SERVICE|#---------');
});
