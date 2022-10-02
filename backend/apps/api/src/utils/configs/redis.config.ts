import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '../../modules/redis/redis.module';

export const RedisDynamicModule = RedisModule.registerAsync({
	imports: [ConfigModule],
	useFactory: async (configService: ConfigService) => {
		const logger = new Logger('RedisModule');

		return {
			connectionOptions: {
				host: configService.get('REDIS_HOST'),
				port: configService.get('REDIS_PORT'),
			},
			onClientReady: (client) => {
				logger.log('Redis client ready');

				client.on('error', (err) => {
					logger.error('Redis Client Error: ', err);
				});

				client.on('connect', () => {
					logger.log(
						`Connect to redis on ${client.options.host}:${client.options.port}`,
					);
				});
			},
		};
	},
	inject: [ConfigService],
});
