import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from '../user/User';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJWTConfig } from '@app/configs/jwt/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './session/session.serializer';

@Module({
  controllers: [AuthController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: User,
        schemaOptions: {
          collection: 'User',
        },
      },
    ]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
    PassportModule.register({ session: true }),
    UserModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    SessionSerializer,
    RolesGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
