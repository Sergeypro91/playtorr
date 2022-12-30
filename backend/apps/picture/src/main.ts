import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { PictureModule } from './picture.module';

async function bootstrap() {
	const logger = new Logger('PICTURE');
	const app = await NestFactory.create(PictureModule);
	await app.init();
	logger.log(`🚀 Picture microservice is running`);
}

bootstrap().then(() => {
	console.log('---------#|Start - PICTURE_SERVICE|#---------');
});
