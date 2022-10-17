import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.model';
import { UserRepository } from './repositories/user.repository';

@Module({
	controllers: [UserController],
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
	providers: [UserRepository, UserService],
	exports: [UserService],
})
export class UserModule {}