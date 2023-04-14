import { Module } from '@nestjs/common';
import { RMQModule } from 'nestjs-rmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getRMQConfig, getJWTConfig } from '@app/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
	controllers: [AuthController],
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				'../envs/.env', // if we`re running service local not in docker
				'../envs/local.env', // if we`re running service local not in docker
				'./apps/auth/envs/.env',
				`${process.env.NODE_ENV}.env`,
			],
		}),
		RMQModule.forRootAsync(getRMQConfig()),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJWTConfig,
		}),
	],
	providers: [AuthService],
})
export class AuthModule {}
