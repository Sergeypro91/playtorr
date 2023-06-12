import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { PublicPreviewModule } from './publicPreview.module';

async function bootstrap() {
	const logger = new Logger('PUBLIC_PREVIEW');
	const app = await NestFactory.create(PublicPreviewModule);
	await app.init();
	logger.log(`🚀 PublicPreview microservice is running`);
}

bootstrap().then(() => {
	console.log('---------#|Start - PUBLIC_PREVIEW_SERVICE|#---------');
});
