import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { MinIOModule } from './minio.module';

async function bootstrap() {
	const logger = new Logger('MINIO');
	const app = await NestFactory.create(MinIOModule);
	await app.init();
	logger.log(`🚀 MinIO microservice is running`);
}
bootstrap().then(() => {
	console.log('---------#|Start - MINIO_SERVICE|#---------');
});
