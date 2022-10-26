import { NestFactory } from '@nestjs/core';
import { TelegramModule } from './telegram.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
	const logger = new Logger('TELEGRAM');
	const app = await NestFactory.create(TelegramModule);
	await app.init();
	logger.log(`🚀 Telegram microservice is running`);
}
bootstrap().then(() => {
	console.log('---------#|Start - TELEGRAM_SERVICE|#---------');
});
