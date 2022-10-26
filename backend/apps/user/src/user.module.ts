import { Module } from '@nestjs/common';
import { RMQModule } from 'nestjs-rmq';
import { ConfigModule } from '@nestjs/config';
import { getMongoConfig, getRMQConfig } from '@app/configs';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models';
import { UserRepository } from './repositories';
import { UserController } from './user.controller';
import { UserService, tet3 } from './user.service';

@Module({
	controllers: [UserController],
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['../envs/.env', './apps/user/envs/.env'],
		}),
		RMQModule.forRootAsync(getRMQConfig()),
		MongooseModule.forRootAsync(getMongoConfig()),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
	providers: [UserRepository, UserService],
})
export class UserModule {}
