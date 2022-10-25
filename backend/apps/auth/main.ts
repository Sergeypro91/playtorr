import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AuthModule } from './src/auth.module';

async function bootstrap() {
	const logger = new Logger('AUTH');
	const app = await NestFactory.create(AuthModule);
	await app.init();
	logger.log(`🚀 Auth microservice is running`);
}

bootstrap().then(() => {
	console.log('---------#|Start - AUTH_SERVICE|#---------');
});
