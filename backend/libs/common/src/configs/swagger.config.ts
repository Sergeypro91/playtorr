import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const swaggerConfig = new DocumentBuilder()
	.setTitle('PlayTorr.API')
	.setDescription('PlayTorr <a href="/api-json">API JSON docs</a>')
	.setVersion('1.0')
	.build();

export const setupSwagger = (app: INestApplication) => {
	const document = SwaggerModule.createDocument(app, swaggerConfig);

	SwaggerModule.setup('api', app, document);
};
