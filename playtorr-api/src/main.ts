import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {} from 'dotenv/config';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const SESSION_KEY = process.env.SESSION_KEY || '';

	app.setGlobalPrefix('api');
	app.use(
		session({
			secret: SESSION_KEY,
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge: 1000 * 60 * 60 * 24,
			},
		}),
	);
	app.use(passport.initialize());
	app.use(passport.session());

	await app.listen(3000);
}

bootstrap();
