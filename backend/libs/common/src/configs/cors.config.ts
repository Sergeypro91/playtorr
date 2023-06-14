import { INestApplication } from '@nestjs/common';

export const setupCors = (app: INestApplication) => {
	const config = {
		origin: [
			'http://localhost:3000',
			'https://localhost:3000',
			'http://localhost:3001',
			'https://localhost:3001',
		],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true,
	};

	app.enableCors(config);
};
