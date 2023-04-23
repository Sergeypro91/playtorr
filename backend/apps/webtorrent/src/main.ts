import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { WebtorrentModule } from './webtorrent.module';

async function bootstrap() {
	const logger = new Logger('WEBTORRENT');
	const app = await NestFactory.create(WebtorrentModule);
	await app.init();
	logger.log(`🚀 Webtorrent microservice is running`);
}

bootstrap().then(() => {
	console.log('---------#|Start - WEBTORRENT_SERVICE|#---------');
});
