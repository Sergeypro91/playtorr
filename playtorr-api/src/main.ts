import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const logger = app.get(Logger);

	app.setGlobalPrefix('api');

	await app.listen(3000);

	logger.log(`Application listening at ${await app.getUrl()}`);
}

bootstrap();
