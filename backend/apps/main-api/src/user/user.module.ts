import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from './User';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SessionSerializer } from '../auth/session/session.serializer';

@Module({
  controllers: [UserController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: User,
        schemaOptions: {
          collection: 'User',
        },
      },
    ]),
  ],
  providers: [UserService, SessionSerializer, RolesGuard],
  exports: [UserService],
})
export class UserModule {}
