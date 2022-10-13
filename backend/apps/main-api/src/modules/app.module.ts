import { RMQModule } from 'nestjs-rmq';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMongoConfig } from '@app/configs/mongo.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MinIOModule } from './minio/minio.module';
import { GetFileModule } from './get-file/get-file.module';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { getMinIOConfig, getRMQConfig } from '../utils/configs';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['../envs/.env', './apps/main-api/src/envs/.env'],
		}),
		RMQModule.forRootAsync(getRMQConfig()),
		MongooseModule.forRootAsync(getMongoConfig()),
		MinIOModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMinIOConfig,
		}),
		AuthModule,
		UserModule,
		ImageUploadModule,
		GetFileModule,
	],
})
export class AppModule {}
