import { RMQModule } from 'nestjs-rmq';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { getMongoConfig, getRMQConfig } from '@app/configs';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['../envs/.env', './apps/auth/src/envs/.env'],
		}),
		RMQModule.forRootAsync(getRMQConfig()),
		MongooseModule.forRootAsync(getMongoConfig()),
		AuthModule,
		UserModule,
	],
})
export class AppModule {}
