import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MailerModule } from './mailer.module';

async function bootstrap() {
	const logger = new Logger('MAILER');
	const app = await NestFactory.create(MailerModule);
	await app.init();
	logger.log(`🚀 Mailer microservice is running`);
}

bootstrap().then(() => {
	console.log('---------#|Start - MAILER_SERVICE|#---------');
});
