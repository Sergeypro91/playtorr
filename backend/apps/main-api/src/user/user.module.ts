import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.model';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SessionSerializer } from '../auth/session/session.serializer';
import { UserRepository } from './repositories/user.repository';

@Module({
	controllers: [UserController],
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
	providers: [UserRepository, UserService, SessionSerializer, RolesGuard],
	exports: [UserService],
})
export class UserModule {}
