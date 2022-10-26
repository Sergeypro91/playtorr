import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from '@app/configs';
import { MinioController } from './minio.controller';
import { MinIOService } from './minio.service';

@Module({
	controllers: [MinioController],
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['../envs/.env', './apps/minio/src/envs/.env'],
		}),
		RMQModule.forRootAsync(getRMQConfig()),
	],
	providers: [MinIOService],
})
export class MinIOModule {}
