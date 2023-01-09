import { createClient } from 'redis';
import * as createRedisStore from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';
import { MiddlewareConsumer } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const configSession = (
	consumer: MiddlewareConsumer,
	configService: ConfigService,
) => {
	const RedisStore = createRedisStore(session);
	const REDIS_PORT = parseInt(configService.get('REDIS_PORT', '6379'), 10);
	const REDIS_HOST = configService.get('REDIS_HOST', 'redis');
	const REDIS_KEY = configService.get('REDIS_KEY', '');
	const REDIS_TTL = parseInt(configService.get('REDIS_TTL', '3600000'), 10);
	const redisClient = createClient({
		socket: {
			port: REDIS_PORT,
			host: REDIS_HOST,
		},
		legacyMode: true,
	});
	redisClient.connect().catch(console.error);

	return consumer
		.apply(
			session({
				store: new RedisStore({
					client: redisClient,
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
};
