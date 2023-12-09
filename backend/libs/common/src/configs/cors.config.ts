import { INestApplication } from '@nestjs/common';
import * as process from 'process';

export const setupCors = (app: INestApplication) => {
	const config = {
		origin: [process.env.CLIENT_URL],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true,
	};

	app.enableCors(config);
};
