import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ParserModule } from './parser.module';

async function bootstrap() {
	const logger = new Logger('MINIO');
	const app = await NestFactory.create(ParserModule);
	await app.init();
	logger.log(`🚀 Parse microservice is running`);
}
bootstrap().then(() => {
	console.log('---------#|Start - PARSER_SERVICE|#---------');
});
