import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { RMQModule } from 'nestjs-rmq';
import { PassportModule } from '@nestjs/passport';
import { getRMQConfig, getPinoConfig } from '@app/configs';
import { RedisDynamicModule } from './configs';
import { JwtStrategy, LocalStrategy } from './strategies';
import { SessionSerializer } from './session';
import { RolesGuard } from './guards';
import { AuthController, UserController, MinIOController } from './controllers';

const test;

@Module({
	controllers: [AuthController, UserController, MinIOController],
	imports: [
		ConfigModule.forRoot({ isGlobal: true, envFilePath: '../envs/.env' }),
		RMQModule.forRootAsync(getRMQConfig()),
		LoggerModule.forRootAsync(getPinoConfig()),
		RedisDynamicModule,
		PassportModule.register({ session: true }),
	],
	providers: [JwtStrategy, LocalStrategy, SessionSerializer, RolesGuard],
})
export class ApiModule {}
