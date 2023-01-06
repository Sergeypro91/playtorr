import { RMQModule } from 'nestjs-rmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getRMQConfig } from '@app/common';
import { MinioController } from './minio.controller';
import { MinIOService } from './minio.service';

@Module({
	controllers: [MinioController],
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['../envs/.env', './apps/minio/envs/.env'],
		}),
		RMQModule.forRootAsync(getRMQConfig()),
	],
	providers: [MinIOService],
})
export class MinIOModule {}
