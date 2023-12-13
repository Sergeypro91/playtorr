import { Module } from '@nestjs/common';
import { RMQModule } from 'nestjs-rmq';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRMQConfig } from '@app/common/configs';
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
	],
	providers: [AuthService, JwtService],
})
export class AuthModule {}
