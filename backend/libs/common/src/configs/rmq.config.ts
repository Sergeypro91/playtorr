import { ConfigModule, ConfigService } from '@nestjs/config';
import { IRMQServiceAsyncOptions } from 'nestjs-rmq';

export const getRMQConfig = (): IRMQServiceAsyncOptions => ({
	inject: [ConfigService],
	imports: [ConfigModule],
	useFactory: (configService: ConfigService) => ({
		exchangeName: configService.get('RMQ_EXCHANGE', ''),
		connections: [
			{
				login: configService.get('RMQ_USER', ''),
				password: configService.get('RMQ_PASS', ''),
				host: configService.get('RMQ_HOST', 'localhost'),
				port: parseInt(configService.get('RMQ_PORT_PLUS', '5672'), 10),
			},
		],
		queueName: configService.get('RMQ_QUEUE', ''),
		prefetchCount: 32,
		serviceName: configService.get('RMQ_SERVICE', ''),
	}),
});
