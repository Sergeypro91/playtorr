import * as process from 'process';
import * as cookieParser from 'cookie-parser';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { setupCors, setupSwagger } from '@app/common/configs';
import { ApiModule } from './api.module';

async function bootstrap() {
	const app = await NestFactory.create(ApiModule);
	const logger = new Logger('API-GATEWAY');
	const globalPrefix = 'api';
	const MAIN_API_PORT = parseInt(process.env.MAIN_API_PORT, 10);

	app.setGlobalPrefix(globalPrefix);

	// GLOBAL VALIDATION SETUPS
	app.useGlobalPipes(
		new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
	);

	// CORS SETUP
	setupCors(app);

	// SWAGGER SETUPS
	setupSwagger(app);

	// COOKIE PARSER  SETUP
	app.use(cookieParser());

	// LISTENING
	await app.listen(MAIN_API_PORT, async () => {
		logger.log(`🚀 API-Gateway start on - ${await app.getUrl()}`);
	});
}

bootstrap().then(() => {
	console.log('---------#|Start - MAIN_API_GATEWAY|#---------');
});
