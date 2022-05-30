import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoConfig } from './configs/mongo.config';
import { TelegramModule } from './telegram/telegram.module';
import { getTelegramConfig } from './configs/telegram.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisDinamicModule } from './configs/redis.config';

@Module({
	controllers: [AppController],
	imports: [
		ConfigModule.forRoot(),
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
		AuthModule,
		UserModule,
	],
	providers: [AppService],
})
export class AppModule {}
