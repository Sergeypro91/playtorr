import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoConfig } from './configs/mongo.config';
import { TelegramModule } from './telegram/telegram.module';
import { getTelegramConfig } from './configs/telegram.config';
import { MinIOModule } from './minio/minio.module';
import { getMinIOConfig } from './configs/minio.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisDinamicModule } from './configs/redis.config';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { GetFileModule } from './get-file/get-file.module';

@Module({
	controllers: [AppController],
	imports: [
		ClientsModule.register([
			{
				name: 'COMMUNICATION',
				transport: Transport.REDIS,
				// TODO pass url from .env
				options: { url: 'redis://localhost:6379' },
			},
		]),
		ConfigModule.forRoot({ envFilePath: '../../.env' }),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		RedisDinamicModule,
		TelegramModule.forRootAsync({
			imports: [ConfigModule, UserModule, AuthModule],
			inject: [ConfigService],
			useFactory: getTelegramConfig,
		}),
		MinIOModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMinIOConfig,
		}),
		ImageUploadModule,
		AuthModule,
		UserModule,
		ImageUploadModule,
		GetFileModule,
	],
	providers: [AppService],
})
export class AppModule {}
