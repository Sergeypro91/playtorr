import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { PersonModule } from './person.module';

async function bootstrap() {
	const logger = new Logger('PERSON');
	const app = await NestFactory.create(PersonModule);
	await app.init();
	logger.log(`🚀 Person microservice is running`);
}

bootstrap().then(() => {
	console.log('---------#|Start - PERSON_SERVICE|#---------');
});
