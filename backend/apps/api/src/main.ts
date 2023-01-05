import { Logger, ValidationPipe } from '@nestjs/common';
import { ApiModule } from './api.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(ApiModule);
	const logger = new Logger('API');
	const globalPrefix = 'api';
	const configService = await app.get(ConfigService);
	const MAIN_API_PORT = parseInt(
		configService.get('MAIN_API_PORT') ?? '3000',
		10,
	);

	app.setGlobalPrefix(globalPrefix);

	// GLOBAL VALIDATION SETUPS
	app.useGlobalPipes(
		new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
	);

	// SWAGGER SETUPS
	const config = new DocumentBuilder()
		.setTitle('PlayTorr.API')
		.setDescription('PlayTorr API docs description')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger', app, document);

	// LISTENING
	await app.listen(MAIN_API_PORT, async () => {
		logger.log(`🚀 API-Gateway start on - ${await app.getUrl()}`);
	});
}

bootstrap().then(() => {
	console.log('---------#|Start - MAIN_API_GATEWAY|#---------');
});
