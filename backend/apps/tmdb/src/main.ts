import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { TmdbModule } from './tmdb.module';

async function bootstrap() {
	const logger = new Logger('TMDB');
	const app = await NestFactory.create(TmdbModule);
	await app.init();
	logger.log(`🚀 Tmdb microservice is running`);
}

bootstrap().then(() => {
	console.log('---------#|Start - TMDB_SERVICE|#---------');
});
