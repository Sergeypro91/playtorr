import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app.module';

async function bootstrap() {
	const logger = new Logger('API');
	const app = await NestFactory.create(AppModule);
	await app.init();
	logger.log(`🚀 Account application is running`);
}

bootstrap().then(() => {
	console.log('---------#|Start - API_SERVICE|#---------');
});
