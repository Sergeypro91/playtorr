import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from '@app/configs/mongo/mongo.config';
import { TelegramModule } from './telegram/telegram.module';
import { getTelegramConfig } from '@app/configs/telegram/telegram.config';
import { MinIOModule } from './minio/minio.module';
import { getMinIOConfig } from '@app/configs/minio/minio.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisDinamicModule } from '@app/configs/redis/redis.config';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { GetFileModule } from './get-file/get-file.module';
import { UserModule } from './user/user.module';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from '@app/configs/rmq/rmq.config';

@Module({
	controllers: [AppController],
	imports: [
		ConfigModule.forRoot({ isGlobal: true, envFilePath: '../envs/.env' }),
		RMQModule.forRootAsync(getRMQConfig()),
		MongooseModule.forRootAsync(getMongoConfig()),
		RedisDinamicModule,
		TelegramModule.forRootAsync({
			imports: [ConfigModule, AuthModule, UserModule],
			inject: [ConfigService],
			useFactory: getTelegramConfig,
		}),
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
	providers: [AppService],
})
export class AppModule {}
