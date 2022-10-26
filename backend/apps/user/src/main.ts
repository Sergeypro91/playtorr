import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { UserModule } from './user.module';

async function bootstrap() {
	const logger = new Logger('USER');
	const app = await NestFactory.create(UserModule);
	await app.init();
	logger.log(`🚀 User microservice is running`);
}
bootstrap().then(() => {
	console.log('---------#|Start - USER_SERVICE|#---------');
});
