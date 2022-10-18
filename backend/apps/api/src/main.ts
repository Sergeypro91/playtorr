import { Logger, ValidationPipe } from '@nestjs/common';
import { ApiModule } from './modules/api.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import Redis from 'ioredis';
import * as RedisStore from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
	const app = await NestFactory.create(ApiModule);
	const logger = new Logger('API');
	const globalPrefix = 'api';
	const redisClient = new Redis();
	const configService = await app.get(ConfigService);
	const MAIN_API_PORT = Number(configService.get('MAIN_API_PORT')) || 3000;
	const REDIS_KEY = configService.get('REDIS_KEY');
	const REDIS_TTL = Number(configService.get('REDIS_TTL'));

	app.setGlobalPrefix(globalPrefix);

	// GLOBAL VALIDATION SETUPS
	app.useGlobalPipes(
		new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
	);

	// SESSION SETUPS
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

	// SWAGGER SETUPS
	const config = new DocumentBuilder()
		.setTitle('PlayTorr.API')
		.setDescription('PlayTorr API docs description')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger', app, document);

	// LISTENING
	await app.listen(MAIN_API_PORT, async () => {
		logger.log(`🚀 PROXY-API start on - ${await app.getUrl()}`);
	});
}

bootstrap().then(() => {
	console.log('---------#|Start - MAIN_API_SERVICE|#---------');
});
