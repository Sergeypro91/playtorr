import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { UsersModule } from './users.module';

async function bootstrap() {
	const logger = new Logger('USERS');
	const app = await NestFactory.create(UsersModule);
	await app.init();
	logger.log(`🚀 Users microservice is running`);
}

bootstrap().then(() => {
	console.log('---------#|Start - USERS_SERVICE|#---------');
});
