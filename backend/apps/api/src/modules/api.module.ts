import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
import { PassportModule } from '@nestjs/passport';
import { RedisDynamicModule, getRMQConfig } from '../utils/configs';
import { JwtStrategy, LocalStrategy } from '../utils/strategies';
import { SessionSerializer } from '../utils/session';
import { RolesGuard } from '../utils/guards';
import { AuthController, UserController, MinIOController } from './controllers';

@Module({
	controllers: [AuthController, UserController, MinIOController],
	imports: [
		ConfigModule.forRoot({ isGlobal: true, envFilePath: '../envs/.env' }),
		RMQModule.forRootAsync(getRMQConfig()),
		RedisDynamicModule,
		PassportModule.register({ session: true }),
	],
	providers: [JwtStrategy, LocalStrategy, SessionSerializer, RolesGuard],
})
export class ApiModule {}
