import Redis from 'ioredis';
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
	const REDIS_HOST = configService.get('REDIS_HOST', 'localhost');
	const REDIS_KEY = configService.get('REDIS_KEY', '');
	const REDIS_TTL = parseInt(configService.get('REDIS_TTL', '3600000'), 10);

	return consumer
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
};
