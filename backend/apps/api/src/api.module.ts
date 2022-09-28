import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './configs/rmq.config';
import { getJWTConfig, RedisDinamicModule } from '@app/configs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../main-api/src/auth/strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './session/session.serializer';
import { RolesGuard } from './guards/roles.guard';
import { UserController } from './controllers/user.controller';

@Module({
	controllers: [AuthController, UserController],
	imports: [
		ConfigModule.forRoot({ isGlobal: true, envFilePath: '../envs/.env' }),
		RMQModule.forRootAsync(getRMQConfig()),
		RedisDinamicModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJWTConfig,
		}),
		PassportModule.register({ session: true }),
	],
	providers: [JwtStrategy, LocalStrategy, SessionSerializer, RolesGuard],
})
export class ApiModule {}
