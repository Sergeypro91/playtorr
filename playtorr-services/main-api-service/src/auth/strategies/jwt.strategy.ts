import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserModel } from '../../user/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: configService.get('JWT_TTL'),
			secretOrKey: configService.get('JWT_SECRET'),
		});
	}

	async validate({ email, role }: Pick<UserModel, 'email' | 'role'>) {
		return { email, role };
	}
}
