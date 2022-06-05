import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = await app.get(ConfigService);
	const MOVIE_PROCESSIONING_PORT = Number(
		configService.get('MOVIE_PROCESSIONING_PORT'),
	);
	const REDIS_HOST = configService.get('REDIS_HOST');
	const REDIS_PORT = configService.get('REDIS_PORT');

	app.connectMicroservice({
		transport: Transport.REDIS,
		options: {
			url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
		},
	});
	await app.startAllMicroservices();
	await app.listen(MOVIE_PROCESSIONING_PORT);
}
bootstrap().then(() => {
	console.log('---------#|Start - MOVIE_PROCESSIONING_SERVICE|#---------');
});
