import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const swaggerConfig = new DocumentBuilder()
	.setTitle('PlayTorr.API')
	.setDescription('PlayTorr API docs description')
	.setVersion('1.0')
	.build();

export const setupSwagger = (app: INestApplication) =>
	SwaggerModule.setup(
		'swagger',
		app,
		SwaggerModule.createDocument(app, swaggerConfig),
	);
