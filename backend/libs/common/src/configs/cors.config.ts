import { INestApplication } from '@nestjs/common';

export const setupCors = (app: INestApplication) => {
	const config = {
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true,
	};

	app.enableCors(config);
};
