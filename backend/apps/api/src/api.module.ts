import { RMQModule } from 'nestjs-rmq';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { configSession, getRMQConfig } from '@app/common';
import {
	TestController,
	AuthController,
	UserController,
	MinIOController,
	ParserController,
	PictureController,
} from './controllers';
import { JwtStrategy, LocalStrategy } from './strategies';
import { SessionSerializer } from './session';
import { RolesGuard } from './guards';
import { LoggerModule } from './logger/logger.module';

@Module({
	controllers: [
		TestController,
		AuthController,
		UserController,
		MinIOController,
		ParserController,
		PictureController,
	],
	imports: [
		ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.env' }),
		RMQModule.forRootAsync(getRMQConfig()),
		PassportModule.register({ session: true }),
		LoggerModule,
	],
	providers: [JwtStrategy, LocalStrategy, SessionSerializer, RolesGuard],
})
export class ApiModule implements NestModule {
	constructor(private readonly configService: ConfigService) {}
	configure(consumer: MiddlewareConsumer) {
		return configSession(consumer, this.configService);
	}
}
