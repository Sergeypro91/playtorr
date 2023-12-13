import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JWTPayload } from '@app/common/types';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	validate(payload: JWTPayload) {
		return payload;
	}
}
