import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './src/app.module';

async function bootstrap() {
	const logger = new Logger('AUTH');
	const app = await NestFactory.create(AppModule);
	await app.init();
	logger.log(`🚀 Auth microservice is running`);
}

bootstrap().then(() => {
	console.log('---------#|Start - AUTH_SERVICE|#---------');
});
